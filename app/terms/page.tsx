import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = {
    title: 'Terms of Service - BrandSphereAI',
    description: 'Read our Terms of Service to understand the rules, guidelines, and terms for using BrandSphereAI.',
}

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 md:py-24">
                <div className="container px-4 md:px-6 max-w-4xl mx-auto">
                    <div className="space-y-8 animate-fade-in">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Terms of Service
                            </h1>
                            <p className="text-muted-foreground">
                                Last updated: March 4, 2025
                            </p>
                        </div>

                        <div className="prose prose-gray max-w-none dark:prose-invert">
                            <p>
                                Welcome to BrandSphereAI. Please read these Terms of Service ("Terms") carefully as they contain important information about your legal rights, remedies, and obligations. By accessing or using BrandSphereAI's services, you agree to be bound by these Terms and our Privacy Policy.
                            </p>

                            <h2>1. Acceptance of Terms</h2>
                            <p>
                                By creating an account, accessing, or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use our services.
                            </p>

                            <h2>2. Description of Service</h2>
                            <p>
                                BrandSphereAI provides a social media management platform that allows users to manage their social media presence, create and schedule content, analyze performance, and engage with their audience ("Service"). We may modify, replace, or discontinue our Service at any time.
                            </p>

                            <h2>3. User Accounts</h2>
                            <p>
                                To use our Service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate, current, and complete information during the registration process and keep your account information updated.
                            </p>

                            <h3>3.1 Authentication Services</h3>
                            <p>
                                We offer the option to sign in with third-party authentication services such as Google and Facebook. When you choose to use these services:
                            </p>
                            <ul>
                                <li>We will only access the information required to authenticate you and provide our services</li>
                                <li>We will request permission to access specific data from these services</li>
                                <li>We do not store your passwords for these third-party services</li>
                                <li>You remain subject to the terms and privacy policies of these third-party services</li>
                            </ul>

                            <h2>4. User Content</h2>
                            <p>
                                Our Service allows you to create, upload, store, and share content. You retain ownership of any intellectual property rights that you hold in that content. By uploading content to our Service, you grant us a worldwide, royalty-free license to use, reproduce, modify, distribute, and display that content solely for the purpose of providing the Service.
                            </p>

                            <h3>4.1 Restrictions on Content</h3>
                            <p>
                                You may not upload, post, or share content that:
                            </p>
                            <ul>
                                <li>Infringes or violates any third party's intellectual property rights</li>
                                <li>Violates any applicable law or regulation</li>
                                <li>Is defamatory, obscene, pornographic, or offensive</li>
                                <li>Contains malware, viruses, or any harmful code</li>
                                <li>Interferes with or disrupts the integrity or performance of the Service</li>
                                <li>Harvests or collects information about other users without their consent</li>
                                <li>Promotes discrimination, bigotry, racism, hatred, harassment, or harm against any individual or group</li>
                            </ul>

                            <h2>5. Social Media Accounts</h2>
                            <p>
                                To use certain features of our Service, you may need to connect your social media accounts. By connecting these accounts, you authorize us to access and interact with these accounts on your behalf. You represent that you have the right to grant us such access and that your use of our Service with these accounts does not violate the terms of service of the respective social media platforms.
                            </p>

                            <h2>6. Payment and Subscription Terms</h2>
                            <p>
                                We offer various subscription plans. By subscribing to a paid plan, you agree to pay the applicable fees. All fees are exclusive of taxes unless stated otherwise. Subscription fees are charged in advance and are non-refundable. We may change our fees upon reasonable notice. You can cancel your subscription at any time, but no refunds will be provided for the current billing period.
                            </p>

                            <h2>7. Data Privacy</h2>
                            <p>
                                Our Privacy Policy explains how we collect, use, and disclose information from our users. By using our Service, you agree to our collection, use, and disclosure of information as described in our Privacy Policy.
                            </p>

                            <h2>8. Intellectual Property</h2>
                            <p>
                                The Service and all content, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by BrandSphereAI, its licensors, or other providers and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                            </p>

                            <h2>9. DMCA & Copyright Policy</h2>
                            <p>
                                We respect the intellectual property of others and expect our users to do the same. We respond to notices of alleged copyright infringement according to the Digital Millennium Copyright Act (DMCA). If you believe your work has been copied in a way that constitutes copyright infringement, please provide us with the information required by the DMCA.
                            </p>

                            <h2>10. Limitation of Liability</h2>
                            <p>
                                To the maximum extent permitted by law, BrandSphereAI, its affiliates, officers, employees, agents, partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.
                            </p>

                            <h2>11. Indemnification</h2>
                            <p>
                                You agree to defend, indemnify, and hold harmless BrandSphereAI, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Service.
                            </p>

                            <h2>12. Termination</h2>
                            <p>
                                We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including, but not limited to, if you breach these Terms. Upon termination, your right to use the Service will immediately cease. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                            </p>

                            <h2>13. Governing Law</h2>
                            <p>
                                These Terms shall be governed by and construed in accordance with the laws of Sweden, without regard to its conflict of law provisions. Any legal action or proceeding relating to your access to, or use of, the Service or these Terms shall be instituted in the courts of Sweden, and you agree to submit to the personal jurisdiction of such courts.
                            </p>

                            <h2>14. Changes to Terms</h2>
                            <p>
                                We may revise these Terms from time to time. The most current version will always be on this page. If the revision, in our sole discretion, is material, we will notify you via email or through the Service. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised Terms.
                            </p>

                            <h2>15. Dispute Resolution</h2>
                            <p>
                                Any disputes arising out of or related to these Terms or the Service shall first be attempted to be resolved through informal negotiations. If the dispute cannot be resolved through negotiations, it shall be submitted to mediation in accordance with the rules of the Swedish Mediation Institute. If mediation is unsuccessful, the dispute shall be finally settled by arbitration in accordance with the rules of the Arbitration Institute of the Stockholm Chamber of Commerce.
                            </p>

                            <h2>16. Third-Party Services</h2>
                            <p>
                                Our Service may contain links to third-party websites or services that are not owned or controlled by BrandSphereAI. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that BrandSphereAI shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
                            </p>

                            <h2>17. Contact Information</h2>
                            <p>
                                If you have any questions about these Terms, please contact us:
                            </p>
                            <ul>
                                <li>Via email: legal@brandsphereai.com</li>
                                <li>Via mail: BrandSphereAI AB, Storgatan 1, 111 23 Stockholm, Sweden</li>
                                <li>Via phone: +46 8 123 45 67</li>
                            </ul>

                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
} 