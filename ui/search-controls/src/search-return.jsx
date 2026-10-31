import React, { useEffect, useState } from 'react';
import Tooltip from '@arco-design/web-react/es/Tooltip';
import '@arco-design/web-react/es/Tooltip/style/css.js';

export function SearchReturn({ id = 'portalSearchReturn', label = '返回搜索首页', onReturn }) {
  const [tipOpen, setTipOpen] = useState(false);
  useEffect(() => {
    const close = () => setTipOpen(false);
    document.addEventListener('portal-search-transition-start', close);
    return () => document.removeEventListener('portal-search-transition-start', close);
  }, []);
  const tipId = `${id}Tip`;
  return <Tooltip content={<span id={tipId}>{label}</span>} trigger={['hover', 'focus']} position="bottom" escToClose popupVisible={tipOpen} onVisibleChange={setTipOpen} triggerProps={{ mouseEnterDelay: 160, mouseLeaveDelay: 80, containerScrollToClose: true }}>
    <button className="portal-search-return" id={id} type="button" aria-label={label} aria-describedby={tipOpen ? tipId : undefined} onClick={() => { setTipOpen(false); onReturn(); }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  </Tooltip>;
}
