const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#505050">
    <path d="M10 17l5-5-5-5v10z"/>
    <path fill="none" d="M0 24V0h24v24H0z"/>
</svg>
`;

export default function () {
  return (new DOMParser().parseFromString(svg, 'image/svg+xml')).firstChild as SVGElement;
}
