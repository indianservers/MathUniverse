/* global window */
export async function freezeDevHotReload(page){
  await page.route('**/*',route=>/^https?:\/\/(?:localhost|127\.0\.0\.1)(?::|\/)/.test(route.request().url())?route.continue():route.abort());
  await page.addInitScript(()=>{
    const Original=window.WebSocket;
    window.WebSocket=class extends Original{
      constructor(url,protocols){super(url,protocols);this.isVite=protocols==='vite-hmr'||Array.isArray(protocols)&&protocols.includes('vite-hmr');}
      addEventListener(type,listener,options){
        if(this.isVite&&type==='message'&&listener){
          const filtered=event=>{
            let message;try{message=JSON.parse(event.data);}catch{/* Preserve non-JSON events. */}
            if(['update','full-reload','prune','error'].includes(message?.type))return;
            if(typeof listener==='function')listener.call(this,event);else listener.handleEvent(event);
          };
          return super.addEventListener(type,filtered,options);
        }
        return super.addEventListener(type,listener,options);
      }
    };
  });
}
