import { savePendingPayment, getSupabaseClient } from './supabase.js';

const UPI_ID = 'ansh74619@okhdfcbank';

/**
 * Initializes pricing interactions including billing toggle and modal.
 */
export function initPricingPage() {
  try {
    bindBillingToggle();
    bindPlanButtons();
    bindPaymentForm();
  } catch (error) {
    console.error('[INCLAW] initPricingPage failed', error);
  }
}

/**
 * Handles monthly/annual pricing UI updates.
 */
function bindBillingToggle() {
  const monthly = document.getElementById('bill-monthly');
  const annual = document.getElementById('bill-annual');
  const prices = [...document.querySelectorAll('[data-monthly]')];
  if (!monthly || !annual) return;

  const apply = (isAnnual) => {
    prices.forEach((el) => {
      const monthlyPrice = Number(el.dataset.monthly);
      const amount = isAnnual ? Math.round(monthlyPrice * 0.8) : monthlyPrice;
      el.textContent = `₹${amount}`;
      el.closest('.price-card')?.querySelector('.plan-cta')?.setAttribute('data-amount', String(amount));
    });
    monthly.classList.toggle('active', !isAnnual);
    annual.classList.toggle('active', isAnnual);
  };

  monthly.addEventListener('click', () => apply(false));
  annual.addEventListener('click', () => apply(true));
}

/**
 * Opens payment modal with selected plan context.
 */
function bindPlanButtons() {
  const modal = document.getElementById('payment-modal');
  const planName = document.getElementById('pay-plan');
  const planAmount = document.getElementById('pay-amount');
  const links = {
    gpay: document.getElementById('upi-gpay'),
    phonepe: document.getElementById('upi-phonepe'),
    paytm: document.getElementById('upi-paytm'),
    any: document.getElementById('upi-any')
  };

  document.querySelectorAll('.plan-cta').forEach((btn) => {
    btn.addEventListener('click', () => {
      try {
        const plan = btn.dataset.plan;
        const amount = Number(btn.dataset.amount || 0);
        if (plan === 'free') {
          location.href = 'chat.html';
          return;
        }
        modal.classList.add('open');
        planName.textContent = plan.toUpperCase();
        planAmount.textContent = `₹${amount}`;
        setUpiLinks(links, amount, plan);
      } catch (error) {
        console.error('[INCLAW] Open payment modal failed', error);
      }
    });
  });

  document.getElementById('modal-close')?.addEventListener('click', () => modal.classList.remove('open'));
}

/**
 * Builds UPI deep links for each payment app.
 */
function setUpiLinks(links, amount, plan) {
  const base = `pa=${encodeURIComponent(UPI_ID)}&pn=AnshKumar&am=${amount}&cu=INR`;
  const tn = `tn=${encodeURIComponent('INCLAW' + plan + 'Plan')}`;
  links.gpay.href = `intent://pay?${base}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
  links.phonepe.href = `intent://pay?${base}#Intent;scheme=upi;package=com.phonepe.app;end`;
  links.paytm.href = `intent://pay?${base}#Intent;scheme=upi;package=net.one97.paytm;end`;
  links.any.href = `upi://pay?${base}&${tn}`;
}

/**
 * Submits payment verification details to Supabase.
 */
function bindPaymentForm() {
  const form = document.getElementById('payment-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('payment-status');
    try {
      const client = getSupabaseClient();
      const user = client ? (await client.auth.getUser())?.data?.user : null;
      const plan = document.getElementById('pay-plan').textContent.toLowerCase();
      const amount = Number((document.getElementById('pay-amount').textContent || '0').replace(/[^0-9]/g, ''));
      const upi_txn_id = document.getElementById('upi-txn').value.trim();
      const instagram_handle = document.getElementById('ig-handle').value.trim();

      await savePendingPayment({
        user_email: user?.email || document.getElementById('pay-email').value.trim(),
        plan,
        amount,
        upi_txn_id,
        instagram_handle,
        status: 'pending',
        created_at: new Date().toISOString()
      });

      const email = user?.email || document.getElementById('pay-email').value.trim();
      status.innerHTML = `\n+        <strong>Payment submitted!</strong><br/>\n+        Ansh will verify via Instagram DM <strong>@ansh._.9900</strong> within 24 hours.<br/>\n+        <small>DM format: INCLAW Payment - ${plan.toUpperCase()} - TXN: ${upi_txn_id} - Email: ${email}</small>\n+      `;
    } catch (error) {
      console.error('[INCLAW] payment submit failed', error);
      status.textContent = `Verification submit failed: ${error.message}`;
    }
  });
}
