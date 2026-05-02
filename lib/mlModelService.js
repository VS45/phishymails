// lib/mlModelService.js
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MLModelService {
    constructor() {
        this.modelLoaded = false;
        // Point to script.py in the script directory
        this.pythonScriptPath = path.join(process.cwd(), 'script', 'script.py');
        
        // Fallback keywords and patterns
        this.phishingKeywords = [
            'verify your account',
            'confirm your identity',
            'suspended',
            'unusual activity',
            'login attempt',
            'update your information',
            'click here',
            'urgent action required',
            'limited time',
            'won a prize',
            'lottery',
            'inheritance',
            'wire transfer',
            'western union',
            'money gram',
            'bitcoin',
            'cryptocurrency',
            'paypal',
            'bank account',
            'credit card',
            'ssn',
            'social security',
            'password expired',
            'security alert',
            'verify your account immediately',
            'account will be closed',
            'confirm your identity now',
            'unusual login activity',
            'suspicious activity detected',
            'immediate action required'
        ];

        this.suspiciousDomains = [
            'secure-verify.com',
            'account-update.net',
            'paypal-security.com',
            'bank-verification.info',
            'amazon-support.co',
            'apple-id-verify.org',
            'microsoft-account.net',
            'dropbox-login.com',
            'google-docs-share.xyz',
            'facebook-security.tk',
            'verify-account.com',
            'security-alert.net',
            'login-verify.org',
            'account-verify.co'
        ];

        this.urgentPatterns = [
            'urgent', 'immediately', 'within 24 hours', 'suspended', 
            'closed', 'terminated', 'legal action', 'as soon as possible',
            'act now', 'expires today', 'final warning', 'account locked'
        ];

        this.personalInfoPatterns = [
            'password', 'ssn', 'social security', 'credit card', 'pin',
            'bank account', 'login credentials', 'verify your identity',
            'account number', 'routing number', 'mother maiden name',
            'date of birth', 'driver license'
        ];
    }

    async loadModel() {
        // Check if Python script exists
        const fs = await import('fs');
        if (!fs.existsSync(this.pythonScriptPath)) {
            console.error(`✗ Python script not found at: ${this.pythonScriptPath}`);
            console.log('  Falling back to rule-based detection');
            this.modelLoaded = false;
            return false;
        }

        // Test if Python script works
        try {
            console.log('Testing Python ML model connection...');
            const result = await this.runPythonScript({
                subject: 'test',
                body: 'test email',
                sender: 'test@example.com'
            });
            
            if (result && typeof result.isPhishing !== 'undefined') {
                this.modelLoaded = true;
                console.log('✓ Python ML model loaded successfully');
                console.log(`  Model confidence: ${result.confidenceScore}%`);
                return true;
            } else {
                throw new Error('Invalid response from Python script');
            }
        } catch (error) {
            console.error('✗ Failed to load Python model:', error.message);
            console.log('  Falling back to rule-based detection');
            this.modelLoaded = false;
            return false;
        }
    }

    async runPythonScript(emailData) {
        return new Promise((resolve, reject) => {
            // Create a timeout to prevent hanging
            const timeout = setTimeout(() => {
                pythonProcess.kill();
                reject(new Error('Python script execution timeout (30 seconds)'));
            }, 30000);
            
            // Spawn Python process with the script path
            const pythonProcess = spawn('python', [this.pythonScriptPath, '--json']);
            
            let outputData = '';
            let errorData = '';
            
            // Prepare input data as JSON
            const inputData = JSON.stringify({
                subject: emailData.subject || '',
                body: emailData.body || '',
                sender: emailData.sender || ''
            });
            
            // Send data to stdin
            pythonProcess.stdin.write(inputData);
            pythonProcess.stdin.end();
            
            // Collect stdout
            pythonProcess.stdout.on('data', (data) => {
                outputData += data.toString();
            });
            
            // Collect stderr
            pythonProcess.stderr.on('data', (data) => {
                errorData += data.toString();
            });
            
            // Handle process completion
            pythonProcess.on('close', (code) => {
                clearTimeout(timeout);
                
                if (code !== 0) {
                    console.error('Python script error output:', errorData);
                    reject(new Error(`Python script exited with code ${code}: ${errorData || 'Unknown error'}`));
                } else {
                    try {
                        // Parse the JSON output
                        const result = JSON.parse(outputData);
                        resolve(result);
                    } catch (e) {
                        console.error('Failed to parse Python output:', outputData);
                        reject(new Error(`Failed to parse Python output: ${e.message}`));
                    }
                }
            });
            
            // Handle process spawn errors
            pythonProcess.on('error', (err) => {
                clearTimeout(timeout);
                reject(new Error(`Failed to start Python process: ${err.message}`));
            });
        });
    }

    async predict(emailData) {
        // Try to use Python model if available
        if (this.modelLoaded) {
            try {
                console.log('Using Python ML model for prediction...');
                const result = await this.runPythonScript({
                    subject: emailData.subject,
                    body: emailData.body,
                    sender: emailData.sender
                });
                
                result.analyzedAt = new Date();
                result.usedModel = 'python_ml';
                
                console.log(`✓ Prediction complete: ${result.status} (${result.confidenceScore}% confidence)`);
                return result;
            } catch (error) {
                console.error('Python script failed, using fallback:', error.message);
                return this.analyzeEmailContent(emailData);
            }
        } else {
            // Use fallback rule-based detection
            console.log('Using fallback rule-based detection...');
            return this.analyzeEmailContent(emailData);
        }
    }

    analyzeEmailContent(emailData) {
        const { subject, body, sender, headers } = emailData;
        const fullText = `${subject} ${body}`.toLowerCase();
        
        const detectionReasons = [];
        let confidenceScore = 0;
        let status = 'safe';

        // 1. Check for phishing keywords
        const foundKeywords = this.phishingKeywords.filter(keyword => 
            fullText.includes(keyword.toLowerCase())
        );

        if (foundKeywords.length > 0) {
            detectionReasons.push({
                reason: `Contains suspicious keywords: ${foundKeywords.slice(0, 3).join(', ')}`,
                category: 'urgent_language',
                severity: foundKeywords.length > 5 ? 'high' : 'medium',
                details: foundKeywords.slice(0, 5),
                weight: foundKeywords.length * 5
            });
            confidenceScore += foundKeywords.length * 5;
        }

        // 2. Check for urgent/threatening language
        const urgentFound = this.urgentPatterns.filter(p => fullText.includes(p));
        if (urgentFound.length > 0) {
            detectionReasons.push({
                reason: `Contains urgent or threatening language: ${urgentFound.slice(0, 3).join(', ')}`,
                category: 'threatening_language',
                severity: 'high',
                details: urgentFound,
                weight: 25
            });
            confidenceScore += 25;
        }

        // 3. Check for requests for personal information
        const personalInfoFound = this.personalInfoPatterns.filter(p => fullText.includes(p));
        if (personalInfoFound.length > 0) {
            detectionReasons.push({
                reason: `Requests personal or financial information: ${personalInfoFound.slice(0, 3).join(', ')}`,
                category: 'request_for_personal_info',
                severity: 'critical',
                details: personalInfoFound,
                weight: 35
            });
            confidenceScore += 35;
        }

        // 4. Extract and analyze links
        const links = this.extractLinks(fullText);
        const suspiciousLinks = links.filter(l => l.isSuspicious);
        
        if (suspiciousLinks.length > 0) {
            detectionReasons.push({
                reason: `Contains ${suspiciousLinks.length} suspicious link(s)`,
                category: 'suspicious_links',
                severity: suspiciousLinks.length > 2 ? 'high' : 'medium',
                details: suspiciousLinks.map(l => l.domain),
                weight: suspiciousLinks.length * 15
            });
            confidenceScore += suspiciousLinks.length * 15;
        }

        // 5. Check for generic greetings
        const genericGreetings = ['dear customer', 'dear user', 'valued member', 'dear sir/madam'];
        const hasGenericGreeting = genericGreetings.some(g => fullText.includes(g));
        if (hasGenericGreeting) {
            detectionReasons.push({
                reason: 'Uses generic greeting instead of personalized address',
                category: 'generic_greeting',
                severity: 'low',
                details: 'Legitimate emails typically address you by name',
                weight: 5
            });
            confidenceScore += 5;
        }

        // 6. Check for grammar issues
        const grammarIssues = this.checkGrammarIssues(fullText);
        if (grammarIssues.length > 0) {
            detectionReasons.push({
                reason: `Contains unusual grammar or spelling errors: ${grammarIssues.slice(0, 3).join(', ')}`,
                category: 'grammar_issues',
                severity: 'low',
                details: grammarIssues.slice(0, 3),
                weight: grammarIssues.length * 2
            });
            confidenceScore += grammarIssues.length * 2;
        }

        // 7. Check for spoofed sender
        if (sender) {
            const domain = sender.split('@')[1];
            if (domain && this.suspiciousDomains.some(d => domain.includes(d))) {
                detectionReasons.push({
                    reason: `Sender domain appears suspicious: ${domain}`,
                    category: 'spoofed_sender',
                    severity: 'high',
                    details: `Domain: ${domain}`,
                    weight: 30
                });
                confidenceScore += 30;
            }
            
            // Check for mismatched sender domain vs. links
            if (links.length > 0 && domain) {
                const mismatchedLinks = links.filter(link => 
                    link.domain !== 'invalid' && !link.domain.includes(domain)
                );
                if (mismatchedLinks.length > 0) {
                    detectionReasons.push({
                        reason: `Links point to different domain than sender (${domain})`,
                        category: 'domain_mismatch',
                        severity: 'high',
                        details: mismatchedLinks.map(l => l.domain),
                        weight: 20
                    });
                    confidenceScore += 20;
                }
            }
        }

        // 8. Check for excessive capitalization
        const capsWords = (fullText.match(/[A-Z]{5,}/g) || []);
        if (capsWords.length > 0) {
            detectionReasons.push({
                reason: 'Excessive capitalization used',
                category: 'grammar_issues',
                severity: 'medium',
                details: capsWords.slice(0, 3),
                weight: 10
            });
            confidenceScore += 10;
        }

        // 9. Check for multiple exclamation marks
        const exclamationCount = (fullText.match(/!{2,}/g) || []).length;
        if (exclamationCount > 0) {
            detectionReasons.push({
                reason: `Multiple exclamation marks used (${exclamationCount})`,
                category: 'grammar_issues',
                severity: 'low',
                details: `Found ${exclamationCount} instances`,
                weight: 5
            });
            confidenceScore += 5;
        }

        // 10. Check for suspicious attachments indicators
        const attachmentIndicators = ['attachment', 'attached', 'download', 'open attached'];
        const hasAttachmentIndicators = attachmentIndicators.some(i => fullText.includes(i));
        if (hasAttachmentIndicators && status !== 'safe') {
            detectionReasons.push({
                reason: 'Email mentions attachments which may contain malware',
                category: 'attachment_warning',
                severity: 'medium',
                details: 'Phishing emails often contain malicious attachments',
                weight: 15
            });
            confidenceScore += 15;
        }

        // Determine status based on confidence score
        if (confidenceScore >= 70) {
            status = 'phishing';
        } else if (confidenceScore >= 40) {
            status = 'suspicious';
        } else if (confidenceScore >= 20) {
            status = 'low_risk';
        } else {
            status = 'safe';
        }

        // Cap confidence score at 100
        confidenceScore = Math.min(confidenceScore, 100);

        // Calculate risk level
        let riskLevel = 'low';
        if (confidenceScore >= 80) riskLevel = 'critical';
        else if (confidenceScore >= 60) riskLevel = 'high';
        else if (confidenceScore >= 40) riskLevel = 'medium';
        else if (confidenceScore >= 20) riskLevel = 'low';
        else riskLevel = 'minimal';

        return {
            status,
            isPhishing: status === 'phishing',
            confidenceScore,
            riskLevel,
            reasons: detectionReasons.sort((a, b) => b.weight - a.weight),
            links,
            features: {
                totalWords: fullText.split(/\s+/).length,
                suspiciousKeywordCount: foundKeywords.length,
                urgentPhraseCount: urgentFound.length,
                personalInfoCount: personalInfoFound.length,
                linkCount: links.length,
                suspiciousLinkCount: suspiciousLinks.length,
                grammarIssueCount: grammarIssues.length,
                exclamationCount: exclamationCount,
                capsWordCount: capsWords.length
            },
            analyzedAt: new Date(),
            usedModel: 'rule_based_fallback'
        };
    }

    extractLinks(text) {
        // Improved URL regex that catches more patterns
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*)/g;
        const urls = text.match(urlRegex) || [];
        
        return urls.map(url => {
            try {
                // Normalize URL
                let normalizedUrl = url;
                if (!normalizedUrl.startsWith('http') && !normalizedUrl.startsWith('www')) {
                    normalizedUrl = 'http://' + normalizedUrl;
                } else if (normalizedUrl.startsWith('www')) {
                    normalizedUrl = 'http://' + normalizedUrl;
                }
                
                const urlObj = new URL(normalizedUrl);
                const domain = urlObj.hostname;
                
                // Check against suspicious domains
                const isSuspicious = this.suspiciousDomains.some(d => domain.includes(d));
                
                // Additional checks
                const hasIpAddress = /^\d+\.\d+\.\d+\.\d+$/.test(domain);
                const hasSuspiciousTld = ['.tk', '.ml', '.ga', '.cf', '.xyz'].some(tld => domain.endsWith(tld));
                const isUrlShortener = ['bit.ly', 'tinyurl.com', 'goo.gl', 'ow.ly'].some(s => domain.includes(s));
                
                let threatLevel = 'safe';
                let reason = null;
                
                if (isSuspicious) {
                    threatLevel = 'suspicious';
                    reason = 'Domain matches known suspicious pattern';
                } else if (hasIpAddress) {
                    threatLevel = 'suspicious';
                    reason = 'URL uses IP address instead of domain name';
                } else if (hasSuspiciousTld) {
                    threatLevel = 'suspicious';
                    reason = 'Suspicious top-level domain';
                } else if (isUrlShortener) {
                    threatLevel = 'caution';
                    reason = 'URL shortener may hide actual destination';
                }
                
                return {
                    url: normalizedUrl,
                    domain,
                    isSuspicious: threatLevel !== 'safe',
                    threatLevel,
                    reason,
                    hasIpAddress,
                    hasSuspiciousTld,
                    isUrlShortener
                };
            } catch (e) {
                return {
                    url,
                    domain: 'invalid',
                    isSuspicious: true,
                    threatLevel: 'suspicious',
                    reason: 'Invalid URL format',
                    parseError: e.message
                };
            }
        });
    }

    checkGrammarIssues(text) {
        const issues = [];
        
        // Check for excessive capitalization
        if ((text.match(/[A-Z]{5,}/g) || []).length > 0) {
            issues.push('Excessive capitalization');
        }
        
        // Check for multiple exclamation marks
        if ((text.match(/!{2,}/g) || []).length > 0) {
            issues.push('Multiple exclamation marks');
        }
        
        // Check for common typos
        const commonTypos = [
            'recieved', 'seperate', 'definately', 'accomodate',
            'privelage', 'maintainance', 'occured', 'untill',
            'wich', 'adress', 'comitte', 'equipement'
        ];
        
        commonTypos.forEach(typo => {
            if (text.includes(typo)) {
                issues.push(`Possible typo: "${typo}"`);
            }
        });
        
        // Check for missing spaces after punctuation
        if (text.match(/[.!?][A-Za-z]/g)) {
            issues.push('Missing spaces after punctuation');
        }
        
        // Check for unusual character repetition
        if (text.match(/(.)\1{4,}/g)) {
            issues.push('Unusual character repetition');
        }
        
        return issues;
    }

    async batchPredict(emails) {
        const results = [];
        for (const email of emails) {
            try {
                const result = await this.predict(email);
                results.push(result);
            } catch (error) {
                console.error('Batch prediction error:', error);
                results.push({
                    status: 'error',
                    error: error.message,
                    isPhishing: false,
                    confidenceScore: 0
                });
            }
        }
        return results;
    }

    getModelInfo() {
        return {
            modelLoaded: this.modelLoaded,
            modelType: this.modelLoaded ? 'python_ml' : 'rule_based',
            pythonScriptPath: this.pythonScriptPath,
            features: {
                keywordCount: this.phishingKeywords.length,
                suspiciousDomainCount: this.suspiciousDomains.length,
                urgentPatternCount: this.urgentPatterns.length,
                personalInfoPatternCount: this.personalInfoPatterns.length
            },
            version: '2.0.0',
            lastUpdated: new Date()
        };
    }
}

// Create singleton instance
const mlModelService = new MLModelService();

// Initialize model on startup (async but don't await)
mlModelService.loadModel().catch(console.error);

export default mlModelService;