const mmpOptions = {
  appsflyer: [
    { value: 'universalAF', text: 'Universal link' },
    { value: 'deeplinkAF', text: 'Deeplink' },
    { value: 'mmpAF', text: 'MMP tracker' },
    { value: 'oneLinkAF', text: 'OneLink' }
  ],
  adjust: [
    { value: 'universalAD', text: 'Universal link' },
    { value: 'deeplinkAD', text: 'Deeplink' },
    { value: 'mmpAD', text: 'MMP tracker' }
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

document.addEventListener('DOMContentLoaded', () => {
  const linkTypeSelect = document.getElementById('linkTypeSelect');
  const deeplinkGroup = document.getElementById('deeplinkGroup');
  const redirectGroup = document.getElementById('redirectGroup');
  const onelinkGroup = document.getElementById('onelinkGroup');
  const generateBtn = document.getElementById('generateBtn');

  function updateVisibleFields() {
    const type = linkTypeSelect.value;

    deeplinkGroup.style.display = ['deeplinkAF', 'mmpAF', 'deeplinkAD', 'mmpAD'].includes(type) ? 'grid' : 'none';
    redirectGroup.style.display = ['universalAF', 'mmpAF', 'universalAD', 'mmpAD'].includes(type) ? 'grid' : 'none';
    onelinkGroup.style.display = ['oneLinkAF'].includes(type) ? 'block' : 'none';
  }

  linkTypeSelect.addEventListener('change', updateVisibleFields);
  updateVisibleFields();

  // Helper to create dynamic result blocks with individual copy buttons
  function createResultBlock(label, value) {
    const block = document.createElement('div');
    block.className = 'result-block';

    block.innerHTML = `
      <label>${label}</label>
      <div class="copy-row">
        <input type="text" readonly value="${value}" />
        <button type="button" class="copy-btn">Copy</button>
      </div>
    `;

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
    const type = linkTypeSelect.value;
    const clWindow = document.getElementById('clWindow').value.trim() || '7d';
    const reWindow = document.getElementById('reWindow').value.trim() || '7d';
    const androidId = document.getElementById('androidId').value.trim() || 'com.globo.globotv';
    const iosId = document.getElementById('iosId').value.trim() || 'id536321738';
    const androidC = document.getElementById('androidC').value.trim() || 'rtbhouse-retargeting';
    const iosC = document.getElementById('iosC').value.trim() || 'rtbhouse-retargeting';
    const androidDp = document.getElementById('androidDp').value.trim() || 'greatapp://path';
    const iosDp = document.getElementById('iosDp').value.trim() || 'greatapp://path';
    const androidRedirect = document.getElementById('androidRedirect').value.trim() || 'https://example.com';
    const iosRedirect = document.getElementById('iosRedirect').value.trim() || 'https://example.com';
    const onelinkDomain = document.getElementById('onelinkDomain').value.trim() || 'https://example.onelink.me/0000';

    const resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) return;
    resultsContainer.innerHTML = ''; // Clear previous results

    switch (type) {
      case 'universalAF':
        resultsContainer.appendChild(createResultBlock('Landing macro for Android:', androidRedirect));
        resultsContainer.appendChild(createResultBlock(
          'Server2server external trackers for Android:',
          `https://app.appsflyer.com/v2.0/s2s/${androidId}?pid=rtbhouse_int&c=${androidC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&redirect=false&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}&af_ip={CLIENT_IP_ADDRESS}&rtbhc={RTBHC}`
        ));
        resultsContainer.appendChild(createResultBlock('Landing macro for iOS:', iosRedirect));
        resultsContainer.appendChild(createResultBlock(
          'Server2server external trackers for iOS:',
          `https://app.appsflyer.com/v2.0/s2s/${iosId}?pid=rtbhouse_int&c=${iosC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&idfa={IOS_IDFA}&redirect=false&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}&af_ip={CLIENT_IP_ADDRESS}&rtbhc={RTBHC}`
        ));
        break;

      case 'deeplinkAF':
        resultsContainer.appendChild(createResultBlock(
          'Android:',
          `https://app.appsflyer.com/${androidId}?pid=rtbhouse_int&c=${androidC}&af_click_lookback={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_reengagement_window=FALSE&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&clickid={SSP_ADVERTISER_ENCRYPTED}&af_siteid={CLIENT_IP_ADDRESS}&af_dp=${androidDp}&af_force_deeplink=true`
        ));
        resultsContainer.appendChild(createResultBlock(
          'iOS:',
          `https://app.appsflyer.com/${iosId}?pid=rtbhouse_int&c=${iosC}&af_click_lookback={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_reengagement_window=FALSE&is_retargeting=true&idfa={IOS_IDFA}&clickid={SSP_ADVERTISER_ENCRYPTED}&af_siteid={CLIENT_IP_ADDRESS}&af_dp=${iosDp}&af_force_deeplink=true`
        ));
        break;

      case 'mmpAF':
        resultsContainer.appendChild(createResultBlock(
          'Android:',
          `https://app.appsflyer.com/${androidId}?pid=rtbhouse_int&c=${androidC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}&af_dp=${androidDp}&af_r=${androidRedirect}&af_force_deeplink=true&rtbhc={RTBHC}`
        ));
        resultsContainer.appendChild(createResultBlock(
          'iOS:',
          `https://app.appsflyer.com/${iosId}?pid=rtbhouse_int&c=${iosC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&idfa={IOS_IDFA}&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}&af_dp=${iosDp}&af_r=${iosRedirect}&af_force_deeplink=true&rtbhc={RTBHC}`
        ));
        break;

      case 'oneLinkAF':
        resultsContainer.appendChild(createResultBlock(
          'Android:',
          `${onelinkDomain}?pid=rtbhouse_int&c=${androidC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}&rtbhc={RTBHC}`
        ));
        resultsContainer.appendChild(createResultBlock(
          'iOS:',
          `${onelinkDomain}?pid=rtbhouse_int&c=${iosC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&idfa={IOS_IDFA}&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}&rtbhc={RTBHC}`
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