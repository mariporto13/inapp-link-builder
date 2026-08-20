const mmpOptions = {
  appsflyer: [
    { value: 'universal', text: 'Universal link' },
    { value: 'deeplink', text: 'Deeplink' },
    { value: 'mmp', text: 'MMP tracker' },
    { value: 'oneLink', text: 'OneLink' }
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

const expandableInputs = document.querySelectorAll('#deeplinkGroup textarea, #redirectGroup textarea');

expandableInputs.forEach(textarea => {
  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
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

    deeplinkGroup.style.display = ['deeplink', 'mmp', 'Option 2', 'Option 3'].includes(type) ? 'grid' : 'none';
    redirectGroup.style.display = ['universal', 'mmp', 'Option 1', 'Option 3'].includes(type) ? 'grid' : 'none';
    onelinkGroup.style.display = ['oneLink', 'Option 4'].includes(type) ? 'block' : 'none';
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
      case 'universal':
      case 'Option 1': // AppsFlyer Universal link
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

      case 'deeplink':
      case 'Option 2': // AppsFlyer Deeplink
        resultsContainer.appendChild(createResultBlock(
          'Android:',
          `https://app.appsflyer.com/${androidId}?pid=rtbhouse_int&c=${androidC}&af_click_lookback={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_reengagement_window=FALSE&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&clickid={SSP_ADVERTISER_ENCRYPTED}&af_siteid={CLIENT_IP_ADDRESS}&af_dp=${androidDp}&af_force_deeplink=true`
        ));
        resultsContainer.appendChild(createResultBlock(
          'iOS:',
          `https://app.appsflyer.com/${iosId}?pid=rtbhouse_int&c=${iosC}&af_click_lookback={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_reengagement_window=FALSE&is_retargeting=true&idfa={IOS_IDFA}&clickid={SSP_ADVERTISER_ENCRYPTED}&af_siteid={CLIENT_IP_ADDRESS}&af_dp=${iosDp}&af_force_deeplink=true`
        ));
        break;

      case 'mmp':
      case 'Option 3': // AppsFlyer MMP tracker
        resultsContainer.appendChild(createResultBlock(
          'Android:',
          `https://app.appsflyer.com/${androidId}?pid=rtbhouse_int&c=${androidC}&af_click_lookback={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_reengagement_window=FALSE&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&clickid={SSP_ADVERTISER_ENCRYPTED}&af_siteid={CLIENT_IP_ADDRESS}&af_dp=${androidDp}&af_r=${androidRedirect}&af_force_deeplink=true`
        ));
        resultsContainer.appendChild(createResultBlock(
          'iOS:',
          `https://app.appsflyer.com/${iosId}?pid=rtbhouse_int&c=${iosC}&af_click_lookback={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_reengagement_window=FALSE&is_retargeting=true&idfa={IOS_IDFA}&clickid={SSP_ADVERTISER_ENCRYPTED}&af_siteid={CLIENT_IP_ADDRESS}&af_dp=${iosDp}&af_r=${iosRedirect}&af_force_deeplink=true`
        ));
        break;

      case 'oneLink':
      case 'Option 4': // AppsFlyer OneLink
        resultsContainer.appendChild(createResultBlock(
          'OneLink:',
          `${onelinkDomain}?pid=rtbhouse_int&c=${androidC}&af_click_lookback={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_reengagement_window=FALSE&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&idfa={IOS_IDFA}&clickid={SSP_ADVERTISER_ENCRYPTED}&af_siteid={RTBHC}`
        ));
        break;

      case 'Option 5': // Adjust Universal link
        resultsContainer.appendChild(createResultBlock(
          'Server2server external trackers for Android:',
          `https://s2s.adjust.com/${androidId}?campaign=rtbhouse_int&rtbhouse_click_id=${androidC}&gps_adid=TRUE&os_name=android&s2s={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}`
        ));
        resultsContainer.appendChild(createResultBlock(
          'Server2server external trackers for iOS:',
          `https://s2s.adjust.com/${iosId}?campaign=rtbhouse_int&rtbhouse_click_id=${iosC}&idfa=TRUE&os_name=ios&s2s={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}`
        ));
        break;

      case 'Option 6': // Adjust Deeplink
        resultsContainer.appendChild(createResultBlock(
          'Android:',
          `https://app.adjust.com/${androidId}?campaign=rtbhouse_int&rtbhouse_click_id=${androidC}&gps_adid=TRUE&deep_link=${androidDp}`
        ));
        resultsContainer.appendChild(createResultBlock(
          'iOS:',
          `https://app.adjust.com/${iosId}?campaign=rtbhouse_int&rtbhouse_click_id=${iosC}&idfa=TRUE&deep_link=${iosDp}`
        ));
        break;

      case 'Option 7': // Adjust MMP tracker
        resultsContainer.appendChild(createResultBlock(
          'Android:',
          `https://app.adjust.com/${androidId}?campaign=rtbhouse_int&rtbhouse_click_id=${androidC}&gps_adid=TRUE&deep_link=${androidDp}&redirect=${androidRedirect}`
        ));
        resultsContainer.appendChild(createResultBlock(
          'iOS:',
          `https://app.adjust.com/${iosId}?campaign=rtbhouse_int&rtbhouse_click_id=${iosC}&idfa=TRUE&deep_link=${iosDp}&redirect=${iosRedirect}`
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