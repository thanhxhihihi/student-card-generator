const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Root route redirect to main page
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// Route for Indian universities page
app.get('/india', (req, res) => {
    res.redirect('/thesinhvien.html');
});

// Route for US universities page
app.get('/us', (req, res) => {
    res.redirect('/thesinhvienus.html');
});

// Proxy endpoint for thispersonnotexist.org
app.post('/api/load-faces', async (req, res) => {
    try {
        console.log('📡 Proxying request to thispersonnotexist.org...');
        console.log('Request body:', req.body);
        
        const response = await fetch('https://thispersonnotexist.org/load-faces', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Origin': 'https://thispersonnotexist.org',
                'Referer': 'https://thispersonnotexist.org/'
            },
            body: JSON.stringify(req.body)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Success! Got', data.fc?.length || 0, 'faces');
            console.log('📋 First face data sample:', data.fc?.[0]?.substring(0, 50) + '...');
            console.log('📋 Full response structure:', JSON.stringify(data, null, 2));
            res.json(data);
        } else {
            console.error('❌ API Error:', response.status, response.statusText);
            res.status(response.status).json({ 
                error: `API returned ${response.status}: ${response.statusText}` 
            });
        }
    } catch (error) {
        console.error('❌ Proxy Error:', error);
        res.status(500).json({ 
            error: 'Proxy server error: ' + error.message 
        });
    }
});

// Proxy endpoint để serve ảnh từ thispersonnotexist.org (giải quyết CORS cho html2canvas)
app.get('/api/image/:base64path', async (req, res) => {
    try {
        const base64path = req.params.base64path;
        const imageUrl = `https://thispersonnotexist.org/downloadimage/${base64path}`;
        
        console.log('🖼️ Proxying image request:', imageUrl);
        
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://thispersonnotexist.org/'
            }
        });

        if (response.ok) {
            // Set proper headers for image
            res.set({
                'Content-Type': response.headers.get('content-type') || 'image/jpeg',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            });
            
            // Pipe the image response
            response.body.pipe(res);
            console.log('✅ Image served successfully');
        } else {
            console.error('❌ Image fetch error:', response.status);
            res.status(response.status).send('Image not found');
        }
    } catch (error) {
        console.error('❌ Image proxy error:', error);
        res.status(500).send('Image proxy error: ' + error.message);
    }
});

// Proxy endpoint để serve barcode từ barcode.tec-it.com (giải quyết CORS cho html2canvas)
app.get('/api/barcode', async (req, res) => {
    try {
        const { data, code } = req.query;
        const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(data)}&code=${code || 'Code128'}&translate-esc=false`;
        
        console.log('📊 Proxying barcode request:', barcodeUrl);
        
        const response = await fetch(barcodeUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (response.ok) {
            // Set proper headers for image
            res.set({
                'Content-Type': response.headers.get('content-type') || 'image/png',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            });
            
            // Pipe the barcode response
            response.body.pipe(res);
            console.log('✅ Barcode served successfully');
        } else {
            console.error('❌ Barcode fetch error:', response.status);
            res.status(response.status).send('Barcode not found');
        }
    } catch (error) {
        console.error('❌ Barcode proxy error:', error);
        res.status(500).send('Barcode proxy error: ' + error.message);
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
    console.log(`📂 Serving files from: ${__dirname}`);
    console.log(`🌐 Open http://localhost:${PORT}/thesinhvien.html in your browser`);
});
