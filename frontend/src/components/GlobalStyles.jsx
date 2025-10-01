import React from 'react';


const GlobalStyles = () => (
<style dangerouslySetInnerHTML={{__html: `
@layer base {
body {
margin: 0;
padding: 0;
min-height: 100vh;
}
}
@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Archivo:wght@400;600;700&display=swap');
`}} />
);


export default GlobalStyles;