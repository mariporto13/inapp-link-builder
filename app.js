// Data mapping available Link Types per MMP
const mmpOptions = {
  appsflyer: [
    { value: 'oneLink', text: 'OneLink Custom URL' },
    { value: 'singlePlatform', text: 'Single Platform Link' }
    // Add future link types here
  ]
};

const mmpSelect = document.getElementById('mmpSelect');
const linkTypeSelect = document.getElementById('linkTypeSelect');

// Dynamically populate Link Types based on MMP selection
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
// Initial population on load
updateLinkTypes();

document.addEventListener('DOMContentLoaded', () => {
  const linkTypeSelect = document.getElementById('linkType');
  const deeplinkGroup = document.getElementById('deeplinkGroup');
  const redirectGroup = document.getElementById('redirectGroup');
  const onelinkGroup = document.getElementById('onelinkGroup');
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');
  const outputResult = document.getElementById('outputResult');

  function updateVisibleFields() {
    const type = linkTypeSelect.value;

    deeplinkGroup.style.display = ['Option 2', 'Option 3'].includes(type) ? 'grid' : 'none';
    redirectGroup.style.display = ['Option 1', 'Option 3'].includes(type) ? 'grid' : 'none';
    onelinkGroup.style.display = (type === 'Option 4') ? 'block' : 'none';
  }

  linkTypeSelect.addEventListener('change', updateVisibleFields);
  updateVisibleFields();

  // Core link generation function adhering to the Base sheet rules
  function buildLinks() {
    const type = linkTypeSelect.value;
    const clWindow = document.getElementById('clWindow').value.trim();
    const reWindow = document.getElementById('reWindow').value.trim();
    const androidId = document.getElementById('androidId').value.trim() || 'com.mcdo.mcdonalds';
    const iosId = document.getElementById('iosId').value.trim() || 'id536321738';
    const androidC = document.getElementById('androidC').value.trim() || 'rtbhouse-retargeting';
    const iosC = document.getElementById('iosC').value.trim() || 'rtbhouse-retargeting';
    const androidDp = document.getElementById('androidDp').value.trim() || 'greatapp://path';
    const iosDp = document.getElementById('iosDp').value.trim() || 'greatapp://path';
    const androidRedirect = document.getElementById('androidRedirect').value.trim() || 'https://example.com';
    const iosRedirect = document.getElementById('iosRedirect').value.trim() || 'https://example.com';
    const onelinkDomain = document.getElementById('onelinkDomain').value.trim() || 'https://example.onelink.me/0000';

    let output = '';

    switch (type) {
      case 'Option 1': // AppsFlyer Universal link
        output += `Landing macro for Android:\n `
        output += `${androidRedirect}\n\n`
        output += `Server2server external trackers for Android:\n `;
        output += `https://app.appsflyer.com/v2.0/s2s/${androidId}?pid=rtbhouse_int&c=${androidC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&redirect=false&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}&af_ip={CLIENT_IP_ADDRESS}&rtbhc={RTBHC}\n\n`;
        output += `Landing macro for iOS:\n `
        output += `${iosRedirect}\n\n`
        output += `Server2server external trackers for iOS:\n `;
        output += `https://app.appsflyer.com/v2.0/s2s/${iosId}?pid=rtbhouse_int&c=${iosC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&idfa={IOS_IDFA}&redirect=false&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}&af_ip={CLIENT_IP_ADDRESS}&rtbhc={RTBHC}`;
        break;

      case 'Option 2': // AppsFlyer Deeplink
        output += `Android:\nhttps://app.appsflyer.com/${androidId}?pid=rtbhouse_int&c=${androidC}&af_click_lookback={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_reengagement_window=FALSE&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&clickid={SSP_ADVERTISER_ENCRYPTED}&af_siteid={CLIENT_IP_ADDRESS}&af_dp=${androidDp}&af_force_deeplink=true\n\n`;
        output += `iOS:\nhttps://app.appsflyer.com/${iosId}?pid=rtbhouse_int&c=${iosC}&af_click_lookback={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_reengagement_window=FALSE&is_retargeting=true&idfa={IOS_IDFA}&clickid={SSP_ADVERTISER_ENCRYPTED}&af_siteid={CLIENT_IP_ADDRESS}&af_dp=${iosDp}&af_force_deeplink=true`;
        break;

      case 'Option 3': // AppsFlyer MMP tracker
        output += `Android:\nhttps://app.appsflyer.com/${androidId}?pid=rtbhouse_int&c=${androidC}&af_click_lookback={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_reengagement_window=FALSE&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&clickid={SSP_ADVERTISER_ENCRYPTED}&af_siteid={CLIENT_IP_ADDRESS}&af_dp=${androidDp}&af_r=${androidRedirect}&af_force_deeplink=true\n\n`;
        output += `iOS:\nhttps://app.appsflyer.com/${iosId}?pid=rtbhouse_int&c=${iosC}&af_click_lookback={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_reengagement_window=FALSE&is_retargeting=true&idfa={IOS_IDFA}&clickid={SSP_ADVERTISER_ENCRYPTED}&af_siteid={CLIENT_IP_ADDRESS}&af_dp=${iosDp}&af_r=${iosRedirect}&af_force_deeplink=true`;
        break;

      case 'Option 4': // AppsFlyer OneLink
        output += `OneLink:\n${onelinkDomain}?pid=rtbhouse_int&c=${androidC}&af_click_lookback={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_reengagement_window=FALSE&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&idfa={IOS_IDFA}&clickid={SSP_ADVERTISER_ENCRYPTED}&af_siteid={RTBHC}`;
        break;

      case 'Option 5': // Adjust Universal link
        output += `Landing macro for Android:\n\nServer2server external trackers for Android:\n`;
        output += `https://s2s.adjust.com/${androidId}?campaign=rtbhouse_int&rtbhouse_click_id=${androidC}&gps_adid=TRUE&os_name=android&s2s={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}\n\n`;
        output += `Landing macro for iOS:\n\nServer2server external trackers for iOS:\n`;
        output += `https://s2s.adjust.com/${iosId}?campaign=rtbhouse_int&rtbhouse_click_id=${iosC}&idfa=TRUE&os_name=ios&s2s={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}`;
        break;

      case 'Option 6': // Adjust Deeplink
        output += `Android:\nhttps://app.adjust.com/${androidId}?campaign=rtbhouse_int&rtbhouse_click_id=${androidC}&gps_adid=TRUE&deep_link=${androidDp}\n\n`;
        output += `iOS:\nhttps://app.adjust.com/${iosId}?campaign=rtbhouse_int&rtbhouse_click_id=${iosC}&idfa=TRUE&deep_link=${iosDp}`;
        break;

      case 'Option 7': // Adjust MMP tracker
        output += `Android:\nhttps://app.adjust.com/${androidId}?campaign=rtbhouse_int&rtbhouse_click_id=${androidC}&gps_adid=TRUE&deep_link=${androidDp}&redirect=${androidRedirect}\n\n`;
        output += `iOS:\nhttps://app.adjust.com/${iosId}?campaign=rtbhouse_int&rtbhouse_click_id=${iosC}&idfa=TRUE&deep_link=${iosDp}&redirect=${iosRedirect}`;
        break;

      default:
        output = 'Invalid link option selected.';
    }

    outputResult.innerText = output;
  }

  generateBtn.addEventListener('click', buildLinks);

  // Copy output text to clipboard
  copyBtn.addEventListener('click', () => {
    const textToCopy = outputResult.innerText;
    if (textToCopy && !textToCopy.startsWith('Select a link type')) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        const origText = copyBtn.innerText;
        copyBtn.innerText = 'Copied!';
        setTimeout(() => copyBtn.innerText = origText, 1800);
      });
    }
  });

  // Helper to render individual copyable blocks in the Results section
  function renderResultBlock(label, value) {
    const block = document.createElement('div');
    block.className = 'result-block';

    block.innerHTML = `
    <label>${label}</label>
    <div class="copy-input-group">
      <input type="text" readonly value="${value}" />
      <button class="copy-btn">Copy</button>
    </div>
  `;

    block.querySelector('.copy-btn').addEventListener('click', (e) => {
      navigator.clipboard.writeText(value);
      e.target.textContent = 'Copied!';
      setTimeout(() => { e.target.textContent = 'Copy'; }, 2000);
    });

    return block;
  }

  // Example usage in your generate results handler:
  function displayResults(androidRedirect, iosRedirect) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = ''; // Clear previous output

    if (androidRedirect) {
      container.appendChild(renderResultBlock('Landing macro for Android:', androidRedirect));
    }
    if (iosRedirect) {
      container.appendChild(renderResultBlock('Landing macro for iOS:', iosRedirect));
    }
  }
});