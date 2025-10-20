// /api/send-estimate.js — works for both Elevate site + Landscaping demo
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  try {
    const data = await readBody(req);

    const name    = str(data.name);
    const email   = str(data.email);
    const phone   = str(data.phone);
    const company = str(data.company);            // Elevate site (index.html)
    const address = str(data.address);            // Landscaping demo (landscaping.html)
    const message = str(data.message || data.notes); // Elevate: message | Landscaping: notes

    if (!name || (!email && !phone)) {
      return res.status(400).json({ error: 'name_and_contact_required' });
    }

    const from       = 'estimates@elevateestimator.com';   // must be a verified Postmark sender
    const toInternal = 'jacob@elevateestimator.com';       // ✅ send to Jacob
    const replyTo    = email || undefined;
    const referer    = str(req.headers['referer']);

    const subject = `New Website Lead — ${name}`;

    await pmSend(process.env.POSTMARK_TOKEN, {
      From: from,
      To: toInternal,
      ReplyTo: replyTo,
      MessageStream: 'outbound',
      Subject: subject,
      TextBody: [
        `Name: ${name}`,
        email   ? `Email: ${email}`     : null,
        phone   ? `Phone: ${phone}`     : null,
        company ? `Company: ${company}` : null,
        address ? `Address: ${address}` : null,
        referer ? `Source: ${referer}`  : null,
        '',
        message ? `Details:\n${message}` : null,
      ].filter(Boolean).join('\n'),
      HtmlBody: `
        <h2>New Website Lead</h2>
        <p><strong>Name:</strong> ${escapeHTML(name)}</p>
        ${email   ? `<p><strong>Email:</strong> ${escapeHTML(email)}</p>`       : ''}
        ${phone   ? `<p><strong>Phone:</strong> ${escapeHTML(phone)}</p>`       : ''}
        ${company ? `<p><strong>Company:</strong> ${escapeHTML(company)}</p>`   : ''}
        ${address ? `<p><strong>Address:</strong> ${escapeHTML(address)}</p>`   : ''}
        ${referer ? `<p><strong>Source:</strong> ${escapeHTML(referer)}</p>`    : ''}
        ${message ? `<p><strong>Details:</strong><br>${escapeHTML(message).replace(/\n/g,'<br>')}</p>` : ''}
      `
    });

    // Customer confirmation (if they left an email)
    if (email) {
      await pmSend(process.env.POSTMARK_TOKEN, {
        From: from,
        To: email,
        ReplyTo: toInternal,
        MessageStream: 'outbound',
        Subject: 'We received your request',
        TextBody: `Thanks ${name}! We received your request and will get back to you${phone ? ` at ${phone}` : ''}.`,
        HtmlBody: `<p>Thanks ${escapeHTML(name)}! We received your request and will get back to you${phone ? ` at <strong>${escapeHTML(phone)}</strong>` : ''}.</p>`
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'send_failed' });
  }
}

function str(v){ return (v ?? '').toString().trim(); }

// Works whether Next/Vercel has already parsed req.body or not
async function readBody(req){
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length) return req.body;

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  const ct = (req.headers['content-type'] || '').toLowerCase();

  if (ct.includes('application/json')) return JSON.parse(raw || '{}');
  if (ct.includes('application/x-www-form-urlencoded')) return Object.fromEntries(new URLSearchParams(raw));
  return {};
}

async function pmSend(token, payload){
  if(!token) throw new Error('Missing POSTMARK_TOKEN env var');
  const r = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': token
    },
    body: JSON.stringify(payload)
  });
  if (!r.ok) {
    const text = await r.text().catch(()=> '');
    throw new Error(`Postmark error ${r.status}: ${text}`);
  }
}

function escapeHTML(s=''){ return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }