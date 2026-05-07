export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';
  const accept = req.headers['accept'] || '';
  const secFetchDest = req.headers['sec-fetch-dest'] || '';
  
  const isBrowser = 
    /Mozilla|Chrome|Safari|Edg|Firefox|Opera/i.test(userAgent) &&
    !/Roblox|Lua|curl|wget|Python|Java/i.test(userAgent); 
  

  const isHtmlRequest = accept.includes('text/html') || secFetchDest === 'document';
  

  if (isBrowser || isHtmlRequest) {

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.status(403).send('Forbidden');
    return;
  }
  
  try {
    const fs = require('fs');
    const path = require('path');
    const scriptPath = path.join(process.cwd(), 'api', 'laserpiwpiw');
    
    if (!fs.existsSync(scriptPath)) {
      return res.status(404).send('Script not found');
    }
    
    const script = fs.readFileSync(scriptPath, 'utf8');
    

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(script);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}
