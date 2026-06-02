export default function TermsOfService() {
  return (
    <div className="card p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">
        Terms of Service
      </h1>

      <div className="mt-6 space-y-6">

        <p>
          By using Syncly, you agree to follow these terms.
        </p>

        <section>
          <h2 className="font-semibold text-lg">
            User Content
          </h2>
          <p className="mt-2">
            You are responsible for the content you post,
            share, or upload.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg">
            Account Responsibility
          </h2>
          <p className="mt-2">
            Keep your account secure and do not share your
            credentials with others.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg">
            Platform Abuse
          </h2>
          <p className="mt-2">
            Attempts to exploit, disrupt, or gain
            unauthorized access to Syncly are prohibited.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg">
            Account Suspension
          </h2>
          <p className="mt-2">
            Syncly may remove content, suspend accounts,
            or permanently ban users who violate platform
            rules.
          </p>
        </section>

      </div>
    </div>
  );
}