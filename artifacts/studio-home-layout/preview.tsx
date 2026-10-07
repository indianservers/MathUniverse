import React from 'react';
import {createRoot} from 'react-dom/client';
import {MemoryRouter} from 'react-router-dom';
import GeometryStudioHome from '../../src/studios/geometry/GeometryStudioHome';
import {studioMockups} from '../../src/studios/mockup/studioMockupCatalog';
import '../../src/studios/mockup/MockupStudioChrome.css';
import '../../src/studios/studioHomeLayout.css';
createRoot(document.getElementById('root')!).render(<MemoryRouter><main style={{gridTemplateColumns:"1fr"}} className="msk-shell msk-geometry" data-lab-id="home"><section className="msk-stage"><GeometryStudioHome studio={studioMockups.geometry}/></section></main></MemoryRouter>);

