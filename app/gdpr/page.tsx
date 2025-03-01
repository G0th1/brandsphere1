import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function GDPRPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 md:py-24">
                <div className="container px-4 md:px-6 max-w-4xl mx-auto">
                    <div className="space-y-8 animate-fade-in">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                GDPR Compliance
                            </h1>
                            <p className="text-muted-foreground">
                                Last updated: June 1, 2023
                            </p>
                        </div>

                        <div className="prose prose-gray max-w-none dark:prose-invert">
                            <p>
                                At BrandSphereAI, we are committed to ensuring the privacy and protection of your personal data in accordance with the General Data Protection Regulation (GDPR). This page explains how we comply with GDPR requirements and outlines your rights as a data subject.
                            </p>

                            <h2>Your Rights Under GDPR</h2>
                            <p>
                                Under the GDPR, you have the following rights regarding your personal data:
                            </p>
                            <ul>
                                <li><strong>Right to Access:</strong> You have the right to request a copy of the personal data we hold about you.</li>
                                <li><strong>Right to Rectification:</strong> You have the right to request that we correct any inaccurate or incomplete personal data we hold about you.</li>
                                <li><strong>Right to Erasure:</strong> You have the right to request that we delete your personal data in certain circumstances.</li>
                                <li><strong>Right to Restrict Processing:</strong> You have the right to request that we restrict the processing of your personal data in certain circumstances.</li>
                                <li><strong>Right to Data Portability:</strong> You have the right to request that we transfer your personal data to another service provider in a structured, commonly used, and machine-readable format.</li>
                                <li><strong>Right to Object:</strong> You have the right to object to the processing of your personal data in certain circumstances, including for direct marketing purposes.</li>
                                <li><strong>Rights Related to Automated Decision Making:</strong> You have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning you or similarly significantly affects you.</li>
                            </ul>

                            <h2>How to Exercise Your Rights</h2>
                            <p>
                                To exercise any of these rights, please contact our Data Protection Officer at <a href="mailto:privacy@brandsphereai.com">privacy@brandsphereai.com</a>. We will respond to your request within 30 days. If we need more time to respond, we will let you know.
                            </p>

                            <h2>Data Processing Activities</h2>
                            <p>
                                We process personal data for the following purposes:
                            </p>
                            <ul>
                                <li>To provide and maintain our services</li>
                                <li>To notify you about changes to our services</li>
                                <li>To provide customer support</li>
                                <li>To gather analysis or valuable information so that we can improve our services</li>
                                <li>To monitor the usage of our services</li>
                                <li>To detect, prevent and address technical issues</li>
                                <li>To fulfill any other purpose for which you provide it</li>
                            </ul>

                            <h2>Legal Basis for Processing</h2>
                            <p>
                                We process your personal data on the following legal bases:
                            </p>
                            <ul>
                                <li><strong>Consent:</strong> You have given us consent to process your personal data for specific purposes.</li>
                                <li><strong>Contract:</strong> Processing is necessary for the performance of a contract with you or to take steps at your request before entering into a contract.</li>
                                <li><strong>Legal Obligation:</strong> Processing is necessary for compliance with a legal obligation to which we are subject.</li>
                                <li><strong>Legitimate Interests:</strong> Processing is necessary for the purposes of the legitimate interests pursued by us or by a third party, except where such interests are overridden by your interests or fundamental rights and freedoms.</li>
                            </ul>

                            <h2>Data Retention</h2>
                            <p>
                                We retain your personal data only for as long as is necessary for the purposes set out in our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. We will retain and use your personal data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
                            </p>

                            <h2>International Data Transfers</h2>
                            <p>
                                Your personal data may be transferred to, and maintained on, computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction. If you are located outside the United States and choose to provide information to us, please note that we transfer the data to the United States and process it there.
                            </p>
                            <p>
                                We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this GDPR Compliance statement and our Privacy Policy. No transfer of your personal data will take place to an organization or a country unless there are adequate controls in place, including the security of your data and other personal information.
                            </p>

                            <h2>Data Protection Officer</h2>
                            <p>
                                We have appointed a Data Protection Officer (DPO) who is responsible for overseeing questions in relation to this GDPR Compliance statement. If you have any questions about this statement, including any requests to exercise your legal rights, please contact our DPO at <a href="mailto:privacy@brandsphereai.com">privacy@brandsphereai.com</a>.
                            </p>

                            <h2>Complaints</h2>
                            <p>
                                You have the right to make a complaint at any time to the supervisory authority for data protection issues in your country. We would, however, appreciate the chance to deal with your concerns before you approach the supervisory authority, so please contact us in the first instance.
                            </p>

                            <h2>Changes to This GDPR Compliance Statement</h2>
                            <p>
                                We may update our GDPR Compliance statement from time to time. We will notify you of any changes by posting the new statement on this page and updating the "Last updated" date at the top of this page. You are advised to review this statement periodically for any changes.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
} 