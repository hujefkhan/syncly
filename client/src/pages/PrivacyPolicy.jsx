export default function PrivacyPolicy() {
  return (
    <div className="card p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">
        Privacy Policy
      </h1>

      <div className="mt-6 space-y-6">

        <p>
          Syncly respects your privacy and aims to protect
          your personal information.
        </p>

        <section>
          <h2 className="font-semibold text-lg">
            Information We Collect
          </h2>
          <p className="mt-2">
            We may collect account information, profile
            details, posts, comments, stories, messages,
            and uploaded content.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg">
            How Information Is Used
          </h2>
          <p className="mt-2">
            Information is used to operate Syncly, provide
            features, improve user experience, and maintain
            platform security.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg">
            Data Sharing
          </h2>
          <p className="mt-2">
            Syncly does not sell user data to third parties.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg">
            Account Data
          </h2>
          <p className="mt-2">
            Users may delete their account using the
            available account deletion tools.
          </p>
        </section>

      </div>
    </div>
  );
}