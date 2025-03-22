export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 prose prose-invert max-w-none">
          <p className="text-sm text-gray-400 mb-6">Last updated: March 1, 2023</p>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
              <p>
                At InfluenceIQ, we value your privacy and are committed to protecting your personal information. This
                Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
                website and services.
              </p>
              <p>
                Please read this Privacy Policy carefully. By accessing or using our service, you acknowledge that you
                have read, understood, and agree to be bound by all the terms of this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-semibold mt-4 mb-2">2.1 Personal Information</h3>
              <p>We may collect personal information that you provide to us, including but not limited to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name, email address, and contact information</li>
                <li>Account login credentials</li>
                <li>Profile information, such as your bio and profile picture</li>
                <li>Content you post, including reviews and comments</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4 mb-2">2.2 Automatically Collected Information</h3>
              <p>
                When you access or use our service, we may automatically collect certain information, including but not
                limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Device information (e.g., device type, operating system)</li>
                <li>IP address and browser type</li>
                <li>Usage data (e.g., pages visited, time spent on pages)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">3. How We Use Your Information</h2>
              <p>We may use the information we collect for various purposes, including to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Create and manage your account</li>
                <li>Process transactions and send related information</li>
                <li>Send administrative messages, updates, and security alerts</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Personalize your experience and deliver content relevant to your interests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, prevent, and address technical issues and fraudulent activities</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">4. How We Share Your Information</h2>
              <p>We may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>With Service Providers:</strong> We may share your information with third-party vendors,
                  service providers, and other partners who perform services on our behalf.
                </li>
                <li>
                  <strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in
                  response to valid legal requests.
                </li>
                <li>
                  <strong>With Your Consent:</strong> We may share your information with third parties when you have
                  given us your consent to do so.
                </li>
                <li>
                  <strong>Business Transfers:</strong> If InfluenceIQ is involved in a merger, acquisition, or sale of
                  all or a portion of its assets, your information may be transferred as part of that transaction.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">5. Your Choices and Rights</h2>
              <p>You have certain choices regarding the information you provide to us:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Account Information:</strong> You can review and update your account information by logging
                  into your account settings.
                </li>
                <li>
                  <strong>Communications:</strong> You can opt out of receiving promotional emails by following the
                  instructions in those emails.
                </li>
                <li>
                  <strong>Cookies:</strong> Most web browsers are set to accept cookies by default. You can usually set
                  your browser to remove or reject cookies.
                </li>
                <li>
                  <strong>Data Access and Portability:</strong> In certain jurisdictions, you have the right to request
                  access to and receive a copy of your personal information.
                </li>
                <li>
                  <strong>Data Deletion:</strong> You may request that we delete your personal information, subject to
                  certain exceptions.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">6. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect the security of your personal
                information. However, please be aware that no security system is impenetrable, and we cannot guarantee
                the absolute security of your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">7. Children's Privacy</h2>
              <p>
                Our services are not intended for children under the age of 13, and we do not knowingly collect personal
                information from children under 13. If we learn that we have collected personal information from a child
                under 13, we will take steps to delete that information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">8. International Data Transfers</h2>
              <p>
                Your information may be transferred to, and maintained on, computers located outside of your state,
                province, country, or other governmental jurisdiction where the data protection laws may differ from
                those in your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">9. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the "Last updated" date at the top.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">10. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@influenceiq.com.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

