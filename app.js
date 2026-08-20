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
  const vtSelect = document.getElementById('vtWindow');
  const impReSelect = document.getElementById('impReWindow');

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
    if (i === 30) opt.selected = true;
    reSelect.add(opt);
  }
  reSelect.add(new Option('lifetime', 'lifetime'));

  if (vtSelect) {
    vtSelect.innerHTML = '';
    for (let i = 1; i <= 24; i++) {
      const opt = new Option(`${i}h`, `${i}h`);
      if (i === 24) opt.selected = true;
      vtSelect.add(opt);
    }
  }

  if (impReSelect) {
    impReSelect.innerHTML = '';
    for (let i = 1; i <= 36; i++) {
      impReSelect.add(new Option(`${i}h`, `${i}h`));
    }
    for (let i = 1; i <= 90; i++) {
      const opt = new Option(`${i}d`, `${i}d`);
      if (i === 30) opt.selected = true;
      impReSelect.add(opt);
    }
    impReSelect.add(new Option('lifetime', 'lifetime'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  populateWindowSelects();

  const linkTypeSelect = document.getElementById('linkTypeSelect');
  const windowGroup = document.getElementById('windowGroup');
  const appIdGroup = document.getElementById('appIdGroup');
  const trackerGroup = document.getElementById('trackerGroup');
  const baseLinkGroup = document.getElementById('baseLinkGroup');
  const deeplinkGroup = document.getElementById('deeplinkGroup');
  const redirectGroup = document.getElementById('redirectGroup');
  const onelinkGroup = document.getElementById('onelinkGroup');
  const impressionGroup = document.getElementById('impressionGroup');
  const impressionCheck = document.getElementById('impressionCheck');
  const generateBtn = document.getElementById('generateBtn');

  function getSelectedPlatform() {
    const selected = document.querySelector('input[name="platformSelect"]:checked');
    return selected ? selected.value : 'both';
  }

  function updateVisibleFields() {
    const mmp = mmpSelect.value;
    const type = linkTypeSelect.value;
    const platform = getSelectedPlatform();

    const showAndroid = platform === 'both' || platform === 'android';
    const showIos = platform === 'both' || platform === 'ios';

    function togglePair(androidFieldId, iosFieldId) {
      const androidEl = document.getElementById(androidFieldId);
      const iosEl = document.getElementById(iosFieldId);
      if (androidEl) androidEl.style.display = showAndroid ? 'block' : 'none';
      if (iosEl) iosEl.style.display = showIos ? 'block' : 'none';
    }

    togglePair('androidIdField', 'iosIdField');
    togglePair('androidTrackerField', 'iosTrackerField');
    togglePair('androidBaseLinkField', 'iosBaseLinkField');
    togglePair('androidCField', 'iosCField');
    togglePair('androidDpField', 'iosDpField');
    togglePair('androidRedirectField', 'iosRedirectField');
    togglePair('androidOnelinkField', 'iosOnelinkField');

    switch (mmp) {
      case 'appsflyer':
        if (windowGroup) windowGroup.style.display = 'block';
        if (appIdGroup) appIdGroup.style.display = 'block';
        if (trackerGroup) trackerGroup.style.display = 'none';
        if (baseLinkGroup) baseLinkGroup.style.display = 'none';
        break;
      case 'adjust':
        if (windowGroup) windowGroup.style.display = 'none';
        if (appIdGroup) appIdGroup.style.display = 'none';
        if (trackerGroup) trackerGroup.style.display = 'block';
        if (baseLinkGroup) baseLinkGroup.style.display = 'none';
        break;
      case 'singular':
        if (windowGroup) windowGroup.style.display = 'none';
        if (appIdGroup) appIdGroup.style.display = 'none';
        if (trackerGroup) trackerGroup.style.display = 'none';
        if (baseLinkGroup) baseLinkGroup.style.display = 'block';
        break;
    }

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

  function toggleImpressionGroup() {
    if (impressionGroup && impressionCheck) {
      impressionGroup.style.display = (impressionCheck.checked && mmpSelect.value === 'appsflyer') ? 'block' : 'none';
    }
  }

  mmpSelect.addEventListener('change', () => {
    updateLinkTypes();
    updateVisibleFields();
    toggleImpressionGroup();
  });
  linkTypeSelect.addEventListener('change', updateVisibleFields);
  
  document.querySelectorAll('input[name="platformSelect"]').forEach(radio => {
    radio.addEventListener('change', updateVisibleFields);
  });

  if (impressionCheck) {
    impressionCheck.addEventListener('change', toggleImpressionGroup);
  }

  updateVisibleFields();
  toggleImpressionGroup();

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

    const mmp = mmpSelect.value;
    const type = linkTypeSelect.value;
    const platform = getSelectedPlatform();

    const doAndroid = platform === 'both' || platform === 'android';
    const doIos = platform === 'both' || platform === 'ios';

    const clWindowInput = document.getElementById('clWindow');
    const reWindowInput = document.getElementById('reWindow');
    const androidIdInput = document.getElementById('androidId');
    const iosIdInput = document.getElementById('iosId');
    const androidTrackerInput = document.getElementById('androidTracker');
    const iosTrackerInput = document.getElementById('iosTracker');
    const androidBaseLinkInput = document.getElementById('androidBaseLink');
    const iosBaseLinkInput = document.getElementById('iosBaseLink');
    const vtWindowInput = document.getElementById('vtWindow');
    const impReWindowInput = document.getElementById('impReWindow');

    const androidDpRaw = document.getElementById('androidDp').value.trim();
    const iosDpRaw = document.getElementById('iosDp').value.trim();
    const androidRedirectRaw = document.getElementById('androidRedirect').value.trim();
    const iosRedirectRaw = document.getElementById('iosRedirect').value.trim();
    const androidOnelinkRaw = document.getElementById('androidOnelink').value.trim();
    const iosOnelinkRaw = document.getElementById('iosOnelink').value.trim();

    const clWindow = clWindowInput ? clWindowInput.value.trim() : '';
    const reWindow = reWindowInput ? reWindowInput.value.trim() : '';
    const androidId = androidIdInput ? androidIdInput.value.trim() : '';
    const iosId = iosIdInput ? iosIdInput.value.trim() : '';
    const androidTracker = androidTrackerInput ? androidTrackerInput.value.trim() : '';
    const iosTracker = iosTrackerInput ? iosTrackerInput.value.trim() : '';
    const androidBaseLink = androidBaseLinkInput ? androidBaseLinkInput.value.trim() : '';
    const iosBaseLink = iosBaseLinkInput ? iosBaseLinkInput.value.trim() : '';

    const generateImpression = impressionCheck?.checked;
    const vtWindow = vtWindowInput ? vtWindowInput.value.trim() : '24h';
    const impReWindow = impReWindowInput ? impReWindowInput.value.trim() : '30d';

    let customParams = document.getElementById('customParams').value.trim();
    if (customParams && !customParams.startsWith('&')) {
      customParams = '&' + customParams;
    }

    const missingFields = [];

    switch (mmp) {
      case 'appsflyer': {
        if (!clWindow) missingFields.push('Click lookback window');
        if (!reWindow) missingFields.push('Reengagement window');
        if (doAndroid && !androidId) missingFields.push('Android App ID');
        if (doIos && !iosId) missingFields.push('iOS App ID');

        if (generateImpression) {
          if (!vtWindow) missingFields.push('Viewthrough lookback window');
          if (!impReWindow) missingFields.push('Impression reengagement window');
        }
        break;
      }

      case 'adjust': {
        if (doAndroid && !androidTracker) missingFields.push('Android Tracker ID');
        if (doIos && !iosTracker) missingFields.push('iOS Tracker ID');
        break;
      }

      case 'singular': {
        if (doAndroid && !androidBaseLink) missingFields.push('Android Base Link');
        if (doIos && !iosBaseLink) missingFields.push('iOS Base Link');
        break;
      }
    }

    switch (type) {
      case 'universalAF':
      case 'universalADJ':
      case 'universalSNG':
        if (doAndroid && !androidRedirectRaw) missingFields.push('Android Link');
        if (doIos && !iosRedirectRaw) missingFields.push('iOS Link');
        break;

      case 'deeplinkAF':
      case 'deeplinkADJ':
      case 'deeplinkSNG':
        if (doAndroid && !androidDpRaw) missingFields.push('Android Deeplink');
        if (doIos && !iosDpRaw) missingFields.push('iOS Deeplink');
        break;

      case 'oneLinkAF':
        if (doAndroid && !androidOnelinkRaw) missingFields.push('Android OneLink');
        if (doIos && !iosOnelinkRaw) missingFields.push('iOS OneLink');
        break;
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

    const androidDp = encodePreservingMacros(androidDpRaw);
    const iosDp = encodePreservingMacros(iosDpRaw);
    const androidRedirect = encodePreservingMacros(androidRedirectRaw);
    const iosRedirect = encodePreservingMacros(iosRedirectRaw);

    switch (type) {
      // APPSFLYER
      case 'universalAF': {
        if (doAndroid) {
          resultsContainer.appendChild(createResultBlock('Landing macro for Android:', androidRedirectRaw));
          resultsContainer.appendChild(createResultBlock(
            'Server2server external trackers URL for Android ("CLICK", "AAID"):',
            `https://app.appsflyer.com/v2.0/s2s/${androidId}?pid=rtbhouse_int&c=${androidC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&redirect=false&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}&af_ip={CLIENT_IP_ADDRESS}${customParams}&rtbhc={RTBHC}`
          ));
        }
        if (doIos) {
          resultsContainer.appendChild(createResultBlock('Landing macro for iOS:', iosRedirectRaw));
          resultsContainer.appendChild(createResultBlock(
            'Server2server external trackers URL for iOS ("CLICK", "IDFA"):',
            `https://app.appsflyer.com/v2.0/s2s/${iosId}?pid=rtbhouse_int&c=${iosC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&idfa={IOS_IDFA}&redirect=false&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}&af_ip={CLIENT_IP_ADDRESS}${customParams}&rtbhc={RTBHC}`
          ));
        }
        break;
      }

      case 'deeplinkAF': {
        if (doAndroid) {
          resultsContainer.appendChild(createResultBlock(
            'Android:',
            `{APPSFLYER_C2S_LINK:https://app.appsflyer.com/${androidId}?pid=rtbhouse_int&c=${androidC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}&af_dp=${androidDp}${customParams}&rtbhc={RTBHC}}`
          ));
        }
        if (doIos) {
          resultsContainer.appendChild(createResultBlock(
            'iOS:',
            `{APPSFLYER_C2S_LINK:https://app.appsflyer.com/${iosId}?pid=rtbhouse_int&c=${iosC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&idfa={IOS_IDFA}&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}&af_dp=${iosDp}${customParams}&rtbhc={RTBHC}}`
          ));
        }
        break;
      }

      case 'mmpAF': {
        if (doAndroid) {
          const androidDpParam = androidDp ? `&af_dp=${androidDp}` : '';
          const androidRedirectParam = androidRedirect ? `&af_r=${androidRedirect}` : '';
          resultsContainer.appendChild(createResultBlock(
            'Android:',
            `{APPSFLYER_C2S_LINK:https://app.appsflyer.com/${androidId}?pid=rtbhouse_int&c=${androidC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}${androidDpParam}${androidRedirectParam}${customParams}&rtbhc={RTBHC}}`
          ));
        }
        if (doIos) {
          const iosDpParam = iosDp ? `&af_dp=${iosDp}` : '';
          const iosRedirectParam = iosRedirect ? `&af_r=${iosRedirect}` : '';
          resultsContainer.appendChild(createResultBlock(
            'iOS:',
            `{APPSFLYER_C2S_LINK:https://app.appsflyer.com/${iosId}?pid=rtbhouse_int&c=${iosC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&idfa={IOS_IDFA}&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}${iosDpParam}${iosRedirectParam}${customParams}&rtbhc={RTBHC}}`
          ));
        }
        break;
      }

      case 'oneLinkAF': {
        if (doAndroid) {
          resultsContainer.appendChild(createResultBlock(
            'Android:',
            `{APPSFLYER_C2S_LINK:${androidOnelinkRaw}?pid=rtbhouse_int&c=${androidC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}${customParams}&rtbhc={RTBHC}}`
          ));
        }
        if (doIos) {
          resultsContainer.appendChild(createResultBlock(
            'iOS:',
            `{APPSFLYER_C2S_LINK:${iosOnelinkRaw}?pid=rtbhouse_int&c=${iosC}&af_click_lookback=${clWindow}&af_reengagement_window=${reWindow}&is_retargeting=true&idfa={IOS_IDFA}&clickid={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}${customParams}&rtbhc={RTBHC}}`
          ));
        }
        break;
      }

      // ADJUST
      case 'universalADJ': {
        if (doAndroid) {
          resultsContainer.appendChild(createResultBlock('Landing macro for Android:', androidRedirectRaw));
          resultsContainer.appendChild(createResultBlock(
            'Server2server external trackers URL for Android ("CLICK", "AAID"):',
            `https://s2s.adjust.com/${androidTracker}?rtbhouse_click_id={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&campaign=${androidC}&s2s=1&gps_adid={ANDROID_ADVERTISING_ID}&os_name=android${customParams}&label={RTBHC}`
          ));
        }
        if (doIos) {
          resultsContainer.appendChild(createResultBlock('Landing macro for iOS:', iosRedirectRaw));
          resultsContainer.appendChild(createResultBlock(
            'Server2server external trackers URL for iOS ("CLICK", "IDFA"):',
            `https://s2s.adjust.com/${iosTracker}?rtbhouse_click_id={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&campaign=${iosC}&s2s=1&idfa={IOS_IDFA}&os_name=ios${customParams}&label={RTBHC}`
          ));
        }
        break;
      }

      case 'deeplinkADJ': {
        if (doAndroid) {
          resultsContainer.appendChild(createResultBlock(
            'Android:',
            `https://app.adjust.com/[ADJUST_TRACKER_ID]?rtbhouse_click_id={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&campaign=rtbhouse-retargeting-android&gps_adid={ANDROID_ADVERTISING_ID}&label={RTBHC}`
          ));
        }
        if (doIos) {
          resultsContainer.appendChild(createResultBlock(
            'iOS:',
            `https://app.adjust.com/[ADJUST_TRACKER_ID]?rtbhouse_click_id={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&campaign=rtbhouse-retargeting-ios&idfa={IOS_IDFA}&label={RTBHC}`
          ));
        }
        break;
      }

      case 'mmpADJ': {
        if (doAndroid) {
          resultsContainer.appendChild(createResultBlock(
            'Android:',
            `https://app.adjust.com/[ADJUST_TRACKER_ID]?rtbhouse_click_id={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&campaign=rtbhouse-retargeting-android&gps_adid={ANDROID_ADVERTISING_ID}&label={RTBHC}`
          ));
        }
        if (doIos) {
          resultsContainer.appendChild(createResultBlock(
            'iOS:',
            `https://app.adjust.com/[ADJUST_TRACKER_ID]?rtbhouse_click_id={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&campaign=rtbhouse-retargeting-ios&idfa={IOS_IDFA}&label={RTBHC}`
          ));
        }
        break;
      }

      // SINGULAR
      case 'universalSNG': {
        if (doAndroid) {
          resultsContainer.appendChild(createResultBlock('Landing macro for Android:', androidRedirectRaw));
          resultsContainer.appendChild(createResultBlock(
            'Server2server external trackers URL for Android ("CLICK", "AAID"):',
            `${androidBaseLink}?aifa={ANDROID_ADVERTISING_ID}&pcn=rtbhouse-retargeting&redirect=false&ip={CLIENT_IP_ADDRESS}`
          ));
        }
        if (doIos) {
          resultsContainer.appendChild(createResultBlock('Landing macro for iOS:', iosRedirectRaw));
          resultsContainer.appendChild(createResultBlock(
            'Server2server external trackers URL for iOS ("CLICK", "IDFA"):',
            `${iosBaseLink}?idfa={IOS_IDFA}&pcn=rtbhouse-retargeting&redirect=false&ip={CLIENT_IP_ADDRESS}`
          ));
        }
        break;
      }

      case 'deeplinkSNG': {
        if (doAndroid) {
          resultsContainer.appendChild(createResultBlock(
            'Android:',
            `https://[DOMAIN].sng.link/[PARAM1]/[PARAM2]?aifa={ANDROID_ADVERTISING_ID}&pcn=rtbhouse-retargeting&_dl={OFFER_URL_ENCODED}&_smtype=3`
          ));
        }
        if (doIos) {
          resultsContainer.appendChild(createResultBlock(
            'iOS:',
            `https://[DOMAIN].sng.link/[PARAM1]/[PARAM2]?idfa={IOS_IDFA}&pcn=rtbhouse-retargeting&_dl={OFFER_URL_ENCODED}&_smtype=3`
          ));
        }
        break;
      }

      case 'mmpSNG': {
        if (doAndroid) {
          resultsContainer.appendChild(createResultBlock(
            'Android:',
            `https://[DOMAIN].sng.link/[PARAM1]/[PARAM2]?aifa={ANDROID_ADVERTISING_ID}&pcn=rtbhouse-retargeting&_dl={OFFER_URL_ENCODED}&_android_redirect={OFFER_URL_ENCODED}&_smtype=3`
          ));
        }
        if (doIos) {
          resultsContainer.appendChild(createResultBlock(
            'iOS:',
            `https://[DOMAIN].sng.link/[PARAM1]/[PARAM2]?idfa={IOS_IDFA}&pcn=rtbhouse-retargeting&_dl={OFFER_URL_ENCODED}&_ios_redirect={OFFER_URL_ENCODED}&_smtype=3`
          ));
        }
        break;
      }

      default:
        resultsContainer.innerHTML = '<p class="placeholder-text">Invalid link option selected.</p>';
    }

    if (generateImpression) {
      switch (mmp) {
        case 'appsflyer': {
          if (doAndroid) {
            resultsContainer.appendChild(createResultBlock(
              'Server2server external trackers Impression URL for Android ("IMPRESSION", "AAID"):',
              `https://impression.appsflyer.com/v2.0/s2s/${androidId}?pid=rtbhouse_int&c=${androidC}&af_viewthrough_lookback=${vtWindow}&af_reengagement_window=${impReWindow}&is_retargeting=true&advertising_id={ANDROID_ADVERTISING_ID}&impression_id={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}`
            ));
          }
          if (doIos) {
            resultsContainer.appendChild(createResultBlock(
              'Server2server external trackers Impression URL for iOS ("IMPRESSION", "IDFA"):',
              `https://impression.appsflyer.com/v2.0/s2s/${iosId}?pid=rtbhouse_int&c=${iosC}&af_viewthrough_lookback=${vtWindow}&af_reengagement_window=${impReWindow}&is_retargeting=true&idfa={IOS_IDFA}&impression_id={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&af_siteid={SSP_ADVERTISER_ENCRYPTED}`
            ));
          }
          break;
        }

        case 'adjust': {
          if (doAndroid) {
            resultsContainer.appendChild(createResultBlock(
              'Server2server external trackers Impression URL for Android ("IMPRESSION", "AAID"):',
              `https://s2s.adjust.com/impression/[ADJUST_TRACKER_ID]?campaign=[CAMPAIGN_NAME]&gps_adid={ANDROID_ADVERTISING_ID}&impression_id={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&rtbhouse_click_id={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&s2s=1&os_name=android`
            ));
          }
          if (doIos) {
            resultsContainer.appendChild(createResultBlock(
              'Server2server external trackers Impression URL for iOS ("IMPRESSION", "IDFA"):',
              `https://s2s.adjust.com/impression/[ADJUST_TRACKER_ID]?campaign=[CAMPAIGN_NAME]&idfa={IOS_IDFA}&impression_id={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&rtbhouse_click_id={IMPRESSION_HASH}-{TIMESTAMP}-{CAMPAIGN_HASH}&s2s=1&os_name=ios`
            ));
          }
          break;
        }

        case 'singular': {
          if (doAndroid) {
            resultsContainer.appendChild(createResultBlock(
              'Server2server external trackers Impression URL for Android ("IMPRESSION", "AAID"):',
              `https://i.sng.link/[PARAM1]/[PARAM2]?aifa={ANDROID_ADVERTISING_ID}&pcn=rtbhouse-retargeting&redirect=false&ip={CLIENT_IP_ADDRESS}&_smtype=3`
            ));
          }
          if (doIos) {
            resultsContainer.appendChild(createResultBlock(
              'Server2server external trackers Impression URL for iOS ("IMPRESSION", "IDFA"):',
              `https://i.sng.link/[PARAM1]/[PARAM2]?idfa={IOS_IDFA}&pcn=rtbhouse-retargeting&redirect=false&ip={CLIENT_IP_ADDRESS}&_smtype=3`
            ));
          }
          break;
        }
      }
    }
  }

  if (generateBtn) {
    generateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      buildLinks();
    });
  }
});