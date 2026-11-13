import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','4175'],{stdio:'ignore'});
let browser;
try {
 for(let i=0;i<60;i++){try{if((await fetch('http://127.0.0.1:4175')).ok)break;}catch{} await new Promise(r=>setTimeout(r,250));}
 browser=await chromium.launch();
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',375,812]]){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:4175');
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(500);
  await page.screenshot({path:'test-results/welcome-'+name+'.png',fullPage:true});
  await page.close();
 }
 console.log('Desktop and mobile previews saved.');
} finally {await browser?.close();server.kill();}
