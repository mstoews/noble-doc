---
title: Noble Ledger Security Policy 
description: Noble Ledger Security Policy
---

Learn how Noble Ledger handles security.

Our users trust Noble Ledger with their sensitive data and rely on us to be good custodians of their customers’ data as well. As a payments infrastructure company, our security posture continually evolves to meet the rigorous standards of the global financial industry.

## Standards and regulations compliance 

Noble Ledger uses best-in-class security practices to maintain a high level of security.

### PCI-certified 

A PCI-certified auditor evaluated Noble Ledger and certified us to [PCI Service Provider Level 1](https://usa.visa.com/splisting/splistinglearnmore.html). This is the most stringent level of certification available in the payments industry. This audit includes both Noble Ledger’s Card Data Vault (CDV) and the secure software development of our integration code.

We provide our users with features to automate some aspects of PCI compliance.

- We analyze the user’s integration method and dynamically inform them of which PCI validation form to use.
- If a user integrates with Noble Ledger Elements, Checkout, Terminal SDKs, or our mobile libraries, we provide assistance in completing their PCI validation form ([Self-Assessment Questionnaire](https://www.pcisecuritystandards.org/pci_security/completing_self_assessment)) in the Dashboard.

### System and Organization Controls (SOC) reports 

Noble Ledger’s systems, processes, and controls are regularly audited as part of our SOC 1 and SOC 2 compliance programs. SOC 1 and SOC 2 Type II reports are produced annually and can be provided upon request.

The Auditing Standards Board of the American Institute of Certified Public Accountants’ ([AICPA](https://www.aicpa.org/)) Trust Service Criteria (TSC) developed the SOC 3 report. Noble Ledger’s SOC 3 is a public report of internal controls over security, availability, and confidentiality. 

### EMVCo standard for card terminals 

Noble Ledger Terminal is certified to the [EMVCo Level 1 and 2](https://www.emvco.com/approved-products/?search_bar_keywords=bbpos&tax%5Bapproved-products_categories%5D%5B90%5D%5B%5D=94%2C95%2C96%2C97%2C99) standards of EMV® Specifications for card and terminal security and interoperability. Terminal is also certified to the [PCI Payment Application Data Security Standard](https://en.wikipedia.org/wiki/PA-DSS) (PA-DSS), the global security standard that aims to prevent payment applications developed for third parties from storing prohibited secure data.

### NIST Cybersecurity Framework 

Noble Ledger’s suite of information security policies and their overarching design are aligned with the [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework/new-framework). Our security practices meet the standards of our enterprise customers who must provide secure products like on-demand cloud computing and storage platforms (for example, DigitalOcean and Slack).

### Privacy and data protection 

The Noble Ledger privacy practices comply with CBPR and PRP systems as evidenced by the CBPR and PRP certifications Noble Ledger has obtained. See the status of our [CBPR](https://privacy.trustarc.com/privacy-seal/validation?rid=31b93f92-8732-402c-9768-f15aabc763f4) and [PRP](https://privacy.trustarc.com/privacy-seal/validation?rid=712f8b7a-6d3c-4484-9522-3bf21d56818a) certifications. Noble Ledger also complies with the US Data Privacy Framework (“EU-US DPF”), the UK Extension to the EU-US DPF, and the Swiss-US Data Privacy Framework as set forth by the US Department of Commerce. See our [certifications](https://www.dataprivacyframework.gov/s/participant-search/participant-detail?id=a2zt0000000TQOUAA4&status=Active).

We continuously implement evolving privacy and data protection processes, procedures, and best practices under all applicable privacy and data protection regimes. For more information, see the following Noble Ledger resources:

- [Privacy Policy](https://nobleledger-doc.com/privacy)
- [Privacy Center](https://nobleledger-doc.com/en-ca/legal/privacy-center)


## Noble Ledger product securement 

Security is one of Noble Ledger’s guiding principles for all our product design and infrastructure decisions. We offer a range of features to help our users better protect their Noble Ledger data.



### Access restriction and auditing 

From the Dashboard, you can assign different detailed [roles](https://docs.stripe.com/get-started/account/teams.md) to enable least-privilege access for your employees, and create [restricted access keys](https://docs.stripe.com/keys-best-practices.md#limit-access) to reduce the security and reliability risk of API key exposure.

You can also view audit logs of important account changes and activity in your [security history](https://dashboard.stripe.com/security_history). These audit logs contain records of sensitive account activity, such as logging in or changing bank account information. We monitor logins and note:

- If they’re from the same or usual devices
- If they’re from consistent IP addresses
- Failed attempts

You can export historical information from the logs. For time-sensitive activities, such as logins from unknown IPs and devices, we send automatic notifications so you don’t need to review logs manually.

### HTTPS and HSTS for secure connections 

We mandate the use of HTTPS for all services using *TLS* (TLS refers to the process of securely transmitting data between the client—the app or browser that your customer is using—and your server. This was originally performed using the SSL (Secure Sockets Layer) protocol) (SSL), including our public website and the [Dashboard](https://dashboard.stripe.com/dashboard). We regularly audit the details of our implementation, including the certificates we serve, the certificate authorities we use, and the ciphers we support. We use [HSTS](http://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security) to make sure that browsers interact with Noble Ledger only over HTTPS. Noble Ledger is also on the HSTS preloaded lists for all modern major browsers.

### Proactive internet monitoring 

We proactively scan the internet for our merchants’ API keys. If we find a compromised key, we take appropriate action, advising the user to roll their API key. We use the GitHub Token Scanner to alert us when a user’s API keys have been leaked on GitHub. If we find external phishing pages that might catch our users, we work proactively with our vendors to take those down and report them to Google Safe Browsing.

## Infrastructure safeguards 

Our security teams test our infrastructure regularly by scanning for vulnerabilities and conducting penetration tests and red team exercises. We hire industry-leading security companies to perform third-party scans of our systems, and we immediately address their findings. Our servers are frequently and automatically replaced to maintain server health and discard stale connections or resources. Server operating systems are upgraded well in advance of their security end of life (EOL) date.

### Dedicated card technology 

Noble Ledger encrypts sensitive data both in transit and at rest. The Noble Ledger infrastructure for storing, decrypting, and transmitting primary account numbers (PANs), such as credit card numbers, runs in a separate hosting infrastructure and doesn’t share any credentials with the rest of our services. A dedicated team manages our CDV in an isolated Amazon Web Services (AWS) environment that’s separate from the rest of the Noble Ledger infrastructure. Access to this separate environment is restricted to a small number of specially trained engineers and access is reviewed quarterly.

All card numbers are encrypted at rest with AES-256. Decryption keys are stored on separate machines. We tokenize PANs internally, isolating raw numbers from the rest of our infrastructure. None of the Noble Ledger internal servers and daemons can obtain plain text card numbers, but they can request that cards are sent to a service provider on a static allowlist. The Noble Ledger infrastructure for storing, decrypting, and transmitting card numbers runs in a separate hosting environment, and doesn’t share any credentials with primary Noble Ledger services, including our API and website. We treat other sensitive data, such as bank account information, similarly to how we tokenize PANs.

### Corporate technology 

Noble Ledger takes a zero-trust approach to employee access management. Employees are authenticated with SSO, two-factor authentication (2FA) using a hardware-based token, and mTLS through a cryptographic certificate on Noble Ledger-issued machines. After connecting to the network, sensitive internal systems and those outside the scope of the employee’s standard work require additional access permissions.

We monitor audit logs to detect abnormalities and watch for intrusions and suspicious activity, and also monitor changes to sensitive files in our code base. All of Noble Ledger’s code goes through multiparty review and automated testing. Code changes are recorded in an immutable, tamper-evident log.

We constantly collect information about Noble Ledger-issued laptops to monitor for malicious processes, connections to fraudulent domains, and intruder activity. We have a comprehensive process for allowlisting permitted software on employee laptops, preventing the installation of non-approved applications.

## Security posture maintenance 

Our developers work with security experts early in a project’s life cycle. As part of our Security Review process, security experts develop threat models and trust boundaries that help guide the implementation of the project. Developers use this same process to make changes to sensitive pieces of code.

### Dedicated experts on-call 

We have a number of dedicated security teams that specialize in different areas of security, including infrastructure, operations, privacy, users, and applications. Security experts are available 24/7 through on-call rotations. We’re focused on constantly raising the bar on best practices to minimize cybersecurity risks.

### Security is every Noble Ledger employee’s job 

We require every Noble Ledger employee to complete annual security education, and we provide secure software development training to Noble Ledger engineers. We run internal phishing campaigns to test everyone at Noble Ledger on recognizing phishing attempts and flagging them to the appropriate security team.

### Managing access control 

We have a formal process for granting access to systems and information, and we regularly review and automatically remove inactive access. Actions within the most sensitive areas of the infrastructure need a human review. To enable best practices for access control, our security experts build primitives to assist Noble Ledger teams in implementing the principle of least privilege. To minimize our exposure, we have a data retention policy that reduces the data we keep while complying with regulatory and business requirements.

