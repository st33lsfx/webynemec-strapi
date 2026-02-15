import { Resend } from 'resend';

/** Odeslat email majiteli webu při nové poptávce */
async function sendContactNotification(contact: {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  source?: string;
  planName?: string | null;
  projectType?: string | null;
  budget?: string | null;
  currentUrl?: string | null;
  pluginLevel?: string | null;
  pluginAddons?: string | null;
  pluginTotal?: number | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Resend] RESEND_API_KEY není nastaven – email se neodešle');
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM || 'onboarding@resend.dev';
  const to = process.env.CONTACT_EMAIL || 'info@webynemec.cz';

  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const sourceLabel = contact.source === 'modal' ? 'Poptávkový modal' : 'Kontaktní formulář';
  const planInfo = contact.planName ? `\n<strong>Balíček:</strong> ${escape(contact.planName)}` : '';
  const projectInfo = contact.projectType ? `\n<strong>Typ projektu:</strong> ${escape(contact.projectType)}` : '';
  const budgetInfo = contact.budget ? `\n<strong>Rozpočet:</strong> ${escape(contact.budget)}` : '';
  const urlInfo = contact.currentUrl ? `\n<strong>Web:</strong> ${escape(contact.currentUrl)}` : '';
  const phoneInfo = contact.phone ? `\n<strong>Telefon:</strong> ${escape(contact.phone)}` : '';
  const pluginLevelInfo = contact.pluginLevel ? `\n<strong>Plugin – složitost:</strong> ${escape(contact.pluginLevel)}` : '';
  const pluginAddonsInfo = contact.pluginAddons ? `\n<strong>Plugin – doplňky:</strong> ${escape(contact.pluginAddons)}` : '';
  const pluginTotalInfo = contact.pluginTotal != null ? `\n<strong>Plugin – orientační cena:</strong> ${contact.pluginTotal.toLocaleString('cs-CZ')} Kč` : '';

  const html = `
    <h2>Nová poptávka z webu (${sourceLabel})</h2>
    <p><strong>Jméno:</strong> ${escape(contact.name)}</p>
    <p><strong>E-mail:</strong> <a href="mailto:${escape(contact.email)}">${escape(contact.email)}</a></p>
    ${phoneInfo ? `<p>${phoneInfo}</p>` : ''}
    ${planInfo || projectInfo || budgetInfo || urlInfo || pluginLevelInfo || pluginAddonsInfo || pluginTotalInfo ? `<p>${planInfo}${projectInfo}${budgetInfo}${urlInfo}${pluginLevelInfo}${pluginAddonsInfo}${pluginTotalInfo}</p>` : ''}
    <h3>Zpráva:</h3>
    <p>${escape(contact.message).replace(/\n/g, '<br>')}</p>
    <hr>
    <p style="color:#666;font-size:12px">Odesláno z webynemec.cz</p>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: `Nová poptávka: ${contact.name}${contact.planName ? ` (${contact.planName})` : contact.pluginLevel ? ` (Plugin: ${contact.pluginLevel})` : ''}`,
      html,
    });
    if (error) {
      console.error('[Resend] Chyba:', error);
    }
  } catch (err) {
    console.error('[Resend] Chyba při odesílání:', err);
  }
}

export default {
  async afterCreate(event: { params: { data: Record<string, unknown> }; result: Record<string, unknown> }) {
    const data = event.result || event.params?.data;
    if (data && typeof data === 'object') {
      await sendContactNotification({
        name: String(data.name ?? ''),
        email: String(data.email ?? ''),
        phone: (data.phone as string) || null,
        message: String(data.message ?? ''),
        source: (data.source as string) || 'contact',
        planName: (data.planName as string) || null,
        projectType: (data.projectType as string) || null,
        budget: (data.budget as string) || null,
        currentUrl: (data.currentUrl as string) || null,
        pluginLevel: (data.pluginLevel as string) || null,
        pluginAddons: (data.pluginAddons as string) || null,
        pluginTotal: (data.pluginTotal as number) ?? null,
      });
    }
  },
};
