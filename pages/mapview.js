import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function MapView() {
  const router = useRouter();
  const { district, panchayath } = router.query;
  const [mapUrl, setMapUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMapUrl() {
      if (!district || !panchayath) return;
      setLoading(true);
      const res = await fetch('/district_localbody_mapping.json');
      const data = await res.json();
      const lbArr = data[district] || [];
      const found = lbArr.find(lb => lb.LocalBody === panchayath);
      setMapUrl(found ? found.HTMLPage : '');
      setLoading(false);
    }
    fetchMapUrl();
  }, [district, panchayath]);

  const title = district && panchayath ? `${district}_${panchayath} Map` : 'Map';

  return (
    <div style={{minHeight:'100vh',minWidth:'100vw',background:'#f5f5f5',padding:'0',margin:'0'}}>
      {loading ? (
        <div style={{textAlign:'center',color:'#888',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading...</div>
      ) : mapUrl ? (
        <iframe
          src={mapUrl}
          title={title}
          width="100%"
          height="100%"
          style={{border:'none',position:'fixed',top:0,left:0,width:'100vw',height:'100vh',margin:0,padding:0}}
          allowFullScreen
        ></iframe>
      ) : (
        <div style={{width:'100vw',height:'100vh',background:'#e0e0e0',display:'flex',alignItems:'center',justifyContent:'center',color:'#888',fontSize:'1.2rem',margin:0,padding:0}}>
          No map found for the selected district and panchayath.
        </div>
      )}
    </div>
  );
} 