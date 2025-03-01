import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground">
                Last updated: June 1, 2023
              </p>
            </div>

            <div className="prose prose-gray max-w-none dark:prose-invert">
              <p>
                At BrandSphereAI, we value your personal privacy and always strive to protect your personal data in the best possible way. This privacy policy explains how we collect, use, store, and share personal data when you use our service.
              </p>

              <h2>1. What information we collect</h2>
              <p>
                We collect the following types of information from our users:
              </p>
              <ul>
                <li><strong>Account information:</strong> When you register for our services, we collect your name, email address, company name, and other information you provide during the registration process.</li>
                <li><strong>Usage data:</strong> Information about how you use our services, including interactions, features you use, and time spent on the platform.</li>
                <li><strong>Device information:</strong> Information about the device you use to access our service, including hardware model, operating system, browser, and IP address.</li>
                <li><strong>Payment information:</strong> If you purchase a paid subscription, we collect payment information. However, we do not store complete credit card details on our servers.</li>
                <li><strong>Communication:</strong> When you communicate with us via email, contact form, or other channels, we save these messages.</li>
              </ul>

              <h2>2. How we use your information</h2>
              <p>
                We use your personal data for the following purposes:
              </p>
              <ul>
                <li>Provide and improve our services</li>
                <li>Process payments and manage your subscription</li>
                <li>Send you important information about your service, including updates and security notices</li>
                <li>Respond to your questions and provide support</li>
                <li>Customize and improve your experience of our service</li>
                <li>Analyze usage patterns and improve our website and services</li>
                <li>Detect, prevent, and handle fraudulent activity or security issues</li>
              </ul>

              <h2>3. How we share your information</h2>
              <p>
                We never sell your personal data to third parties. However, we may share your information in the following situations:
              </p>
              <ul>
                <li><strong>Service providers:</strong> We use third-party providers to help us operate our business (e.g., payment processors, hosting providers). These have access to your information only to perform these tasks and are obligated not to use or disclose it for other purposes.</li>
                <li><strong>Business transfers:</strong> If we are involved in a merger, acquisition, or sale of assets, your information may be transferred. We will notify you before your personal data is transferred and becomes subject to a different privacy policy.</li>
                <li><strong>Legal requirements:</strong> We may disclose your information if we are required to do so by law or to protect our rights, property, or safety, our users' or others' rights, property, or safety.</li>
              </ul>

              <h2>4. Data storage</h2>
              <p>
                We store your personal data as long as your account is active or as long as needed to provide the service. We may retain certain information even after you have closed your account if necessary to fulfill our legal obligations, resolve disputes, or enforce our agreements.
              </p>

              <h2>5. Your rights</h2>
              <p>
                Depending on your residence, you have certain rights regarding your personal data, which may include:
              </p>
              <ul>
                <li>Right to access your personal data</li>
                <li>Right to correct inaccurate data</li>
                <li>Right to delete your data</li>
                <li>Right to restrict processing of your data</li>
                <li>Right to data portability</li>
                <li>Right to object to processing of your data</li>
              </ul>
              <p>
                To exercise these rights, please contact us via privacy@brandsphereai.com.
              </p>

              <h2>6. Cookies and tracking technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some parts of our service.
              </p>

              <h2>7. Data protection</h2>
              <p>
                We use appropriate technical and organizational measures to protect your personal data against loss, misuse, and unauthorized access. Unfortunately, no method of electronic transmission or storage is 100% secure, so we cannot guarantee absolute security.
              </p>

              <h2>8. Changes to this policy</h2>
              <p>
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date. You are encouraged to review this privacy policy periodically for any changes.
              </p>

              <h2>9. Contact us</h2>
              <p>
                If you have questions about this privacy policy, please contact us:
              </p>
              <ul>
                <li>Via email: privacy@brandsphereai.com</li>
                <li>Via mail: BrandSphereAI Inc., 123 Main Street, New York, NY 10001, USA</li>
                <li>Via phone: +1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 