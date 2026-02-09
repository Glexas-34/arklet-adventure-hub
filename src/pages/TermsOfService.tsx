import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground animated-bg">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Arklet Arks
        </Link>

        <h1 className="text-3xl md:text-4xl font-black mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: February 7, 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Arklet Arks ("the Service"), you agree to be bound by these Terms
              of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">2. Description of Service</h2>
            <p>
              Arklet Arks is a free-to-play online pack simulator and multiplayer game. The Service
              allows users to open virtual packs, collect items, trade with other players, and
              participate in multiplayer game modes. All items and collectibles are virtual and hold no
              real-world monetary value.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">3. User Accounts and Nicknames</h2>
            <p>
              You are responsible for maintaining the confidentiality of your chosen nickname. You agree
              not to impersonate other users, administrators, or any other person. Nicknames that are
              offensive, misleading, or violate these terms may be removed or banned without notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-foreground/80">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to exploit, hack, or manipulate the Service or its data</li>
              <li>Use automated tools, bots, or scripts to interact with the Service</li>
              <li>Harass, bully, or send abusive messages to other users</li>
              <li>Impersonate administrators or other users</li>
              <li>Spam or flood the chat or trading systems</li>
              <li>Attempt to manipulate leaderboards, inventories, or game results</li>
              <li>Interfere with or disrupt the Service or servers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">5. Virtual Items</h2>
            <p>
              All virtual items, including Arks of any rarity, are the property of Arklet Arks. You
              are granted a limited, non-transferable license to use virtual items within the Service.
              Virtual items have no real-world value and cannot be exchanged for money, goods, or
              services outside of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">6. Chat and Communication</h2>
            <p>
              The global chat feature is provided for player communication. Messages are subject to
              moderation. We reserve the right to remove messages and ban users who violate these terms.
              Do not share personal information, external links, or inappropriate content in the chat.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">7. Trading</h2>
            <p>
              Trades between players are final once both parties accept. We are not responsible for
              trades you consider unfair after completion. Do not attempt to scam or deceive other
              players during trades.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">8. Moderation and Enforcement</h2>
            <p>
              We reserve the right to ban, restrict, or terminate access for any user who violates these
              terms, at our sole discretion and without prior notice. Banned users may not create new
              accounts to circumvent their ban.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">9. Data and Privacy</h2>
            <p>
              The Service stores your chosen nickname, game statistics, inventory data, chat messages,
              and trade history. We do not collect personal identifying information beyond what you
              voluntarily provide (your nickname). Inventory data is stored locally in your browser and
              may be lost if you clear your browser data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">10. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "as is" and "as available" without warranties of any kind, either
              express or implied. We do not guarantee that the Service will be uninterrupted,
              error-free, or free of harmful components. We are not responsible for any loss of virtual
              items, progress, or data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">11. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Arklet Arks and its operators shall not be
              liable for any indirect, incidental, special, consequential, or punitive damages arising
              from your use of or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">12. Changes to Terms</h2>
            <p>
              We reserve the right to update these Terms of Service at any time. Continued use of the
              Service after changes constitutes acceptance of the updated terms. We encourage you to
              review these terms periodically.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">13. Contact</h2>
            <p>
              If you have questions about these Terms of Service, please reach out through the in-game
              chat or contact an administrator.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-muted-foreground">
          <p>Arklet Arks - Pack Simulator</p>
        </div>
      </div>
    </div>
  );
}
