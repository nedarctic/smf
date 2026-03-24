import { Separator } from "@/components/ui/separator";

function Capability({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-medium text-black dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function SemaFactsInfoPage() {
  return (
    <main className="min-h-screen w-full">
      <section className="min-h-screen bg-white dark:bg-black flex items-center px-6">
        <div className="max-w-5xl mx-auto w-full flex flex-col gap-24 py-20">

          {/* Hero */}
          <header className="flex flex-col gap-8">
            <h1 className="text-black dark:text-white text-5xl md:text-6xl lg:text-7xl font-light tracking-tight">
              SemaFacts
            </h1>

            <div className="max-w-2xl flex flex-col gap-4">
              <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg font-light leading-relaxed">
                SemaFacts is a secure whistleblowing and incident management
                platform designed to enable safe reporting, structured
                investigations, and accountable resolution of organizational
                issues.
              </p>

              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-light leading-relaxed">
                The platform provides confidential reporting channels, role-based
                access control, audit-ready workflows, and secure communication
                between reporters and assigned handlers.
              </p>
            </div>
          </header>

          {/* Capabilities */}
          <section className="flex flex-col gap-16 border-t border-gray-200 dark:border-zinc-800 pt-16">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">

              <Capability
                title="Secure reporting"
                description="Submit incidents anonymously or confidentially, including detailed descriptions, involved parties, locations, dates, and supporting evidence."
              />

              <Capability
                title="Incident tracking"
                description="Track submitted reports using a unique Incident ID and secret code, with full visibility into status updates and communication history."
              />

              <Capability
                title="Incident management"
                description="Assign handlers, manage deadlines, update statuses, and oversee the full lifecycle of each case through a structured workflow."
              />

              <Capability
                title="Role-based access"
                description="Control access through defined roles including administrators and handlers, ensuring secure and appropriate visibility across the system."
              />

              <Capability
                title="Secure communication"
                description="Enable direct, protected messaging between reporters and handlers while maintaining confidentiality and traceability."
              />

              <Capability
                title="Audit and accountability"
                description="Maintain a complete audit trail of actions, including assignments, status changes, messages, and timeline updates for compliance and governance."
              />

            </div>
          </section>

          {/* Workflow */}
          <section className="flex flex-col gap-10 border-t border-gray-200 dark:border-zinc-800 pt-16">
            <h2 className="text-2xl font-light text-black dark:text-white">
              Incident workflow
            </h2>

            <div className="flex flex-col gap-6 text-sm text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
              <p>
                Incidents progress through a structured lifecycle beginning with
                submission, followed by review, investigation, resolution, and
                closure. Each stage ensures clarity, accountability, and proper
                handling of sensitive information.
              </p>

              <p>
                Assigned handlers manage investigations, communicate with
                reporters when necessary, and document actions taken. All updates
                are tracked to maintain a consistent and auditable process.
              </p>
            </div>
          </section>

          {/* Status */}
          <section className="flex flex-col gap-10 border-t border-gray-200 dark:border-zinc-800 pt-16">
            <h2 className="text-2xl font-light text-black dark:text-white">
              Status system
            </h2>

            <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span>New</span>
              <Separator orientation="vertical" />
              <span>In review</span>
              <Separator orientation="vertical" />
              <span>Investigation</span>
              <Separator orientation="vertical" />
              <span>Resolved</span>
              <Separator orientation="vertical" />
              <span>Closed</span>
            </div>
          </section>

          {/* Closing */}
          <section className="border-t border-gray-200 dark:border-zinc-800 pt-16">
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
              SemaFacts enables organizations to foster transparency and trust
              by providing a secure environment for reporting, investigating,
              and resolving critical incidents with confidence and integrity.
            </p>
          </section>

        </div>
      </section>
    </main>
  );
}
