const mmpOptions = {
  appsflyer: [
    { value: 'universalAF', text: 'Universal link' },
    { value: 'deeplinkAF', text: 'Deeplink' },
    { value: 'mmpAF', text: 'MMP tracker' },
    { value: 'oneLinkAF', text: 'OneLink' }
  ],
  adjust: [
    { value: 'universalADJ', text: 'Universal link' },
    { value: 'deeplinkADJ', text: 'Deeplink' },
    { value: 'mmpADJ', text: 'MMP tracker' }
  ],
  singular: [
    { value: 'universalSNG', text: 'Universal link' },
    { value: 'deeplinkSNG', text: 'Deeplink' },
    { value: 'mmpSNG', text: 'MMP tracker' }
  ]
};

const mmpSelect = document.getElementById('mmpSelect');
const linkTypeSelect = document.getElementById('linkTypeSelect');

function updateLinkTypes() {
  const selectedMMP = mmpSelect.value;
  const options = mmpOptions[selectedMMP] || [];

  linkTypeSelect.innerHTML = '';
  options.forEach(opt => {
    const optionEl = document.createElement('option');
    optionEl.value = opt.value;
    optionEl.textContent = opt.text;
    linkTypeSelect.appendChild(optionEl);
  });
}

mmpSelect.addEventListener('change', updateLinkTypes);
updateLinkTypes();

const textareas = document.querySelectorAll('#deeplinkGroup textarea, #redirectGroup textarea');

textareas.forEach(textarea => {
  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  });
});

function encodePreservingMacros(str) {
  if (!str) return '';
  return str.split(/(\{.*?\})/g).map(part => {
    if (part.startsWith('{') && part.endsWith('}')) {
      return part;
    }
    return encodeURIComponent(part);
  }).join('');
}

function populateWindowSelects() {
  const clSelect = document.getElementById('clWindow');
  const reSelect = document.getElementById('reWindow');

  if (!clSelect || !reSelect) return;

  clSelect.innerHTML = '';
  for (let i = 1; i <= 23; i++) {
    clSelect.add(new Option(`${i}h`, `${i}h`));
  }
  for (let i = 1; i <= 30; i++) {
    const opt = new Option(`${i}d`, `${i}d`);
    if (i === 7) opt.selected = true;
    clSelect.add(opt);
  }

  reSelect.innerHTML = '';
  for (let i = 1; i <= 36; i++) {
    reSelect.add(new Option(`${i}h`, `${i}h`));
  }
  for (let i = 1; i <= 90; i++) {
    const opt = new Option(`${i}d`, `${i}d`);
    if (i === 7) opt.selected = true;
    reSelect.add(opt);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  populateWindowSelects();

  const linkTypeSelect = document.getElementById('linkTypeSelect');
  const deeplinkGroup = document.getElementById('deeplinkGroup');
  const redirectGroup = document.getElementById('redirectGroup');
  const onelinkGroup = document.getElementById('onelinkGroup');
  const generateBtn = document.getElementById('generateBtn');

  function updateVisibleFields() {
    const type = linkTypeSelect.value;

    deeplinkGroup.style.display = [
      'deeplinkAF',
      'mmpAF',
      'deeplinkADJ',
      'mmpADJ',
      'deeplinkSNG',
      'mmpSNG',
    ].includes(type) ? 'block' : 'none';

    redirectGroup.style.display = [
      'universalAF',
      'mmpAF',
      'universalADJ',
      'mmpADJ',
      'universalSNG',
      'mmpSNG',
    ].includes(type) ? 'block' : 'none';

    onelinkGroup.style.display = ['oneLinkAF'].includes(type) ? 'block' : 'none';
  }

  linkTypeSelect.addEventListener('change', updateVisibleFields);
  updateVisibleFields();

  function createResultBlock(label, value) {
    const block = document.createElement('div');
    block.className = 'result-block';

    block.innerHTML = `<label>${label}</label>
    <div class="copy-row">
      <textarea readonly rows="2">${value}</textarea>
      <button type="button" class="copy-btn">Copy</button>
    </div>`;

    const textarea = block.querySelector('textarea');
    setTimeout(() => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }, 0);

    const copyBtn = block.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(value);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 2000);
    });

    return block;
  }

  function buildLinks() {
    const resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) return;

    const type = linkTypeSelect.value;

    const clWindowInput = document.getElementById('clWindow');
    const reWindowInput = document.getElementById('reWindow');
    const androidIdInput = document.getElementById('androidId');
    const iosIdInput = document.getElementById('iosId');

    const androidDpRaw = document.getElementById('androidDp').value.trim();
    const iosDpRaw = document.getElementById('iosDp').value.trim();
    const androidRedirectRaw = document.getElementById('androidRedirect').value.trim();
    const iosRedirectRaw = document.getElementById('iosRedirect').value.trim();
    const androidOnelinkRaw = document.getElementById('androidOnelink').value.trim();

    const clWindow = clWindowInput ? clWindowInput.value.trim() : '';
    const reWindow = reWindowInput ? reWindowInput.value.trim() : '';
    const androidId = androidIdInput ? androidIdInput.value.trim() : '';
    const iosId = iosIdInput ? iosIdInput.value.trim() : '';

    let customParams = document.getElementById('customParams').value.trim();
    if (customParams && !customParams.startsWith('&')) {
      customParams = '&' + customParams;
    }

    const missingFields = [];
    if (!clWindow) missingFields.push('Click lookback window');
    if (!reWindow) missingFields.push('Reengagement window');
    if (!androidId) missingFields.push('Android App ID');
    if (!iosId) missingFields.push('iOS App ID');

    if (['universalAF', 'universalADJ', 'universalSNG'].includes(type)) {
      if (!androidRedirectRaw) missingFields.push('Android Link');
      if (!iosRedirectRaw) missingFields.push('iOS Link');
    }

    if (['deeplinkAF', 'deeplinkADJ', 'deeplinkSNG'].includes(type)) {
      if (!androidDpRaw) missingFields.push('Android Deeplink');
      if (!iosDpRaw) missingFields.push('iOS Deeplink');
    }

    if (['oneLinkAF'].includes(type)) {
      if (!androidOnelinkRaw) missingFields.push('Android OneLink');
    }

    if (missingFields.length > 0) {
      resultsContainer.innerHTML = `
        <div style="color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; padding: 1rem; border-radius: 6px;">
          <strong>Please fill in all required fields for this link type:</strong>
          <ul style="margin: 0.5rem 0 0 1.25rem; padding: 0;">
            ${missingFields.map(field => `<li>${field}</li>`).join('')}
          </ul>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = '';

    const androidC = document.getElementById('androidC').value.trim() || 'rtbhouse-retargeting';
    const iosC = document.getElementById('iosC').value.trim() || 'rtbhouse-retargeting';
    const iosOnelinkRaw = document.getElementById('iosOnelink').value.trim() || androidOnelinkRaw;

    const androidDp = encodePreservingMacros(androidDpRaw);
    const iosDp = encodePreservingMacros(iosDpRaw);
    const androidRedirect = encodePreservingMacros(androidRedirectRaw);
    const iosRedirect = encodePreservingMacros(iosRedirectRaw);

    switch (type) {
      case 'universalAF':
        resultsContainer.appendChild(createResultBlock('Landing macro for Android:', androidRedirectRaw));
        resultsContainer.appendChild(createResultBlock(
          'Server2server external trackers for Android:',
          `https://app.appsflyer.com/v2.0/s2s/${androidId}?pid=rtbhouse_int&c=${androidC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&redirect=false&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}&af_ip={CLIENT_IP_ADDRESS}&rtbhc={RTBHC}${customParams}`
        ));
        resultsContainer.appendChild(createResultBlock('Landing macro for iOS:', iosRedirectRaw));
        resultsContainer.appendChild(createResultBlock(
          'Server2server external trackers for iOS:',
          `https://app.appsflyer.com/v2.0/s2s/${iosId}?pid=rtbhouse_int&c=${iosC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&idfa={IOS_IDFA}&redirect=false&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}&af_ip={CLIENT_IP_ADDRESS}&rtbhc={RTBHC}${customParams}`
        ));
        break;

      case 'deeplinkAF':
        resultsContainer.appendChild(createResultBlock(
          'Android:',
          `https://app.appsflyer.com/${androidId}?pid=rtbhouse_int&c=${androidC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}&af_dp=${androidDp}${customParams}&rtbhc={RTBHC}`
        ));
        resultsContainer.appendChild(createResultBlock(
          'iOS:',
          `https://app.appsflyer.com/${iosId}?pid=rtbhouse_int&c=${iosC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&idfa={IOS_IDFA}&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}&af_dp=${iosDp}${customParams}&rtbhc={RTBHC}`
        ));
        break;

      case 'mmpAF': {
        const androidDpParam = androidDp ? `&af_dp=${androidDp}` : '';
        const androidRedirectParam = androidRedirect ? `&af_r=${androidRedirect}` : '';
        const iosDpParam = iosDp ? `&af_dp=${iosDp}` : '';
        const iosRedirectParam = iosRedirect ? `&af_r=${iosRedirect}` : '';

        resultsContainer.appendChild(createResultBlock(
          'Android:',
          `https://app.appsflyer.com/${androidId}?pid=rtbhouse_int&c=${androidC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}${androidDpParam}${androidRedirectParam}${customParams}&rtbhc={RTBHC}`
        ));
        resultsContainer.appendChild(createResultBlock(
          'iOS:',
          `https://app.appsflyer.com/${iosId}?pid=rtbhouse_int&c=${iosC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&idfa={IOS_IDFA}&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}${iosDpParam}${iosRedirectParam}${customParams}&rtbhc={RTBHC}`
        ));
        break;
      }

      case 'oneLinkAF':
        resultsContainer.appendChild(createResultBlock(
          'Android:',
          `${androidOnelinkRaw}?pid=rtbhouse_int&c=${androidC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}${customParams}&rtbhc={RTBHC}`
        ));
        resultsContainer.appendChild(createResultBlock(
          'iOS:',
          `${iosOnelinkRaw}?pid=rtbhouse_int&c=${iosC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&idfa={IOS_IDFA}&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}${customParams}&rtbhc={RTBHC}`
        ));
        break;

      default:
        resultsContainer.innerHTML = '<p class="placeholder-text">Invalid link option selected.</p>';
    }
  }

  if (generateBtn) {
    generateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      buildLinks();
    });
  }
});