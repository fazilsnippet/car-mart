
import { useEffect } from "react";
import { MdFavoriteBorder, MdChatBubbleOutline, MdAccountCircle, MdMenu, MdArrowForward, MdSpeed, MdLocalGasStation, MdSettings, MdLocationOn, MdVerified, MdDiamond, MdHandshake, MdAccountBalance, MdCheck } from "react-icons/md";
import astonMartin from "./assets/aston-martin.jpg";
export default function WishWheels() {
  useEffect(() => {
    const links = [
      ["https://fonts.googleapis.com", "preconnect"],
      ["https://fonts.gstatic.com", "preconnect"],
    ];
    const existing = document.querySelector('link[data-wish-wheels-fonts]');
    if (!existing) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap";
      link.dataset.wishWheelsFonts = "true";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f9] text-[#1a1c1c] antialiased overflow-x-hidden font-sans">


<main>
{/*1. Cinematic Full-width Hero*/}
<section className="relative w-full max-w-[1440px]">
<div className="relative w-full h-[614px] md:h-[768px] bg-[#e9e8e8] overflow-hidden group">
<img className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105" data-alt="A cinematic, ultra-high-resolution photograph of a sleek silver luxury sports car parked in a minimalist, light-filled modern showroom. The environment features expansive white walls, subtle architectural lines, and soft, diffused natural lighting that reflects off the vehicle's pristine metallic paint. The scene perfectly aligns with a high-end, light-mode automotive user interface aesthetic, using a sophisticated palette of soft creams, stark whites, and deep metallic charcoals to convey exclusivity and premium craftsmanship." src={astonMartin}/>
{/*Overlay Content*/}
<div className="absolute inset-0 flex flex-col justify-end p-margin-mobile md:p-margin-desktop bg-gradient-to-t from-surface/90 to-transparent md:w-2/3 lg:w-1/2">
<h1 className="font-sans md:font-sans text-[40px] leading-[1.2] tracking-[-0.01em] font-bold md:text-[64px] md:leading-[1.1] md:tracking-[-0.02em] md:font-bold text-black mb-6">Drive The Extraordinary</h1>
<p className="font-sans text-[18px] leading-[1.6] font-normal text-[#444748] mb-8 max-w-md">A curated selection of the world's finest automobiles. Engineered for performance, crafted for elegance.</p>
<div className="flex flex-wrap items-center gap-4 mb-8">
<button className="bg-black text-white font-sans text-[12px] leading-none tracking-[0.1em] font-bold uppercase px-8 py-4 hover:bg-[#faf9f9]-tint transition-colors">Explore Cars</button>
<button className="border border-[#747878] text-black font-sans text-[12px] leading-none tracking-[0.1em] font-bold uppercase px-8 py-4 hover:bg-white transition-colors">Sell Your Car</button>
</div>
<div className="flex items-center gap-8 border-t border-[#c4c7c7]/30 pt-6">
<div>
<span className="block font-sans text-[24px] leading-[1.4] font-semibold text-black">120K+</span>
<span className="block font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-[#444748] uppercase mt-1">Cars Available</span>
</div>
<div>
<span className="block font-sans text-[24px] leading-[1.4] font-semibold text-black">8K+</span>
<span className="block font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-[#444748] uppercase mt-1">Happy Clients</span>
</div>
</div>
</div>
</div>
</section>
{/*2. Featured Luxury Cars*/}
<section className="max-w-[1440px] mx-auto px-5 md:px-16 py-[120px]">
<div className="flex justify-between items-end mb-12 border-b border-[#c4c7c7]/30 pb-4">
<h2 className="font-sans text-[32px] leading-[1.3] font-semibold text-black">Featured Vehicles</h2>
<a className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-black uppercase flex items-center hover:text-[#444748] transition-colors" href="#">View Inventory <span className="inline-flex items-center justify-center ml-2 text-lg"><MdArrowForward /></span></a>
</div>
<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
{/*Card 1*/}
<article className="group border border-[#c4c7c7]/30 bg-white hover:border-[#747878] transition-colors">
<div className="relative h-64 overflow-hidden bg-[#e9e8e8]">
<img className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" data-alt="A pristine white BMW X4 M Competition parked against a minimalist concrete wall. High contrast, sharp focus, professional automotive photography emphasizing the aggressive front grille and sleek aerodynamic lines. Bright, neutral lighting suitable for a luxury e-commerce catalog." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdsZjMc89PbNjd1Ttly3HyXq2Wnz1KWriJaj4wHJlOtNiuVKo2ULoXdrCS_IWmylCcJhcI9X3InKwQFLGuaA2363zCJpj-6ZyLpK1tkWpsChz1vBbgfsz0KFhNzA63UharjgLBk-revs2YaIkY5AQC_bp7gfvHm3SgGu41PH7MWq3HWBY9uQZMaobJq9TVR2i1JYnHzPw389xlQ1DgOvOFDot4nsMHn0F2Fixfyx6oMghxJ6LCS29hng"/>
<button className="absolute top-4 right-4 p-2 bg-[#faf9f9]/80 backdrop-blur rounded-full text-black hover:bg-[#faf9f9]">
<span className="inline-flex items-center justify-center text-lg"><MdFavoriteBorder /></span>
</button>
</div>
<div className="p-6">
<div className="flex items-start justify-between mb-4">
<div>
<h3 className="font-sans text-[24px] leading-[1.4] font-semibold text-black">BMW X4 M Shadow</h3>
<p className="font-sans text-[16px] leading-[1.6] font-normal text-[#444748]">2024</p>
</div>
<span className="font-sans text-[24px] leading-[1.4] font-semibold text-black">₹ 98,00,000</span>
</div>
<div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-[#c4c7c7]/30">
<div className="flex items-center gap-2">
<span className="inline-flex items-center justify-center text-[#747878] text-sm"><MdSpeed /></span>
<div className="flex flex-col">
<span className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-[#747878] uppercase text-[10px]">Mileage</span>
<span className="font-sans text-[16px] leading-[1.6] font-normal text-black text-sm font-semibold">9,500 km</span>
</div>
</div>
<div className="flex items-center gap-2">
<span className="inline-flex items-center justify-center text-[#747878] text-sm"><MdLocalGasStation /></span>
<div className="flex flex-col">
<span className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-[#747878] uppercase text-[10px]">Fuel</span>
<span className="font-sans text-[16px] leading-[1.6] font-normal text-black text-sm font-semibold">Petrol</span>
</div>
</div>
<div className="flex items-center gap-2">
<span className="inline-flex items-center justify-center text-[#747878] text-sm"><MdSettings /></span>
<div className="flex flex-col">
<span className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-[#747878] uppercase text-[10px]">Transmission</span>
<span className="font-sans text-[16px] leading-[1.6] font-normal text-black text-sm font-semibold">Automatic</span>
</div>
</div>
<div className="flex items-center gap-2">
<span className="inline-flex items-center justify-center text-[#747878] text-sm"><MdLocationOn /></span>
<div className="flex flex-col">
<span className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-[#747878] uppercase text-[10px]">Location</span>
<span className="font-sans text-[16px] leading-[1.6] font-normal text-black text-sm font-semibold">Bangalore</span>
</div>
</div>
</div>
<button className="w-full border border-primary text-black font-sans text-[12px] leading-none tracking-[0.1em] font-bold uppercase py-3 hover:bg-black hover:text-white transition-colors">View Details</button>
</div>
</article>
{/*Card 2*/}
<article className="group border border-[#c4c7c7]/30 bg-white hover:border-[#747878] transition-colors hidden md:block">
<div className="relative h-64 overflow-hidden bg-[#e9e8e8]">
<img className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" data-alt="A sleek black Porsche 911 Carrera S situated in an empty, naturally lit modern warehouse. The smooth metallic paint reflects the structural beams above. Cinematic lighting, sharp focus on the iconic curved silhouette. High-end editorial style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6tPpiNO-zGicr1ZuBT3NDtipgBRyZV7kdiMhcUeFuTfUPzRNniJcyIi2LMfCMTR_5nXgv_R3cCHRqoj5XSlYrEKHTJJQXdmclHcwcO-cDrjDMFgPkkNMK63FfbGbJPi17fNbNm_3kQicZoSB7gUBMljiq732ghE2P6ddO4BCX6NYnxpSIhysdna7plr4bRksojJAQHkdJ1Ql3Kp5bMCXyW1_VhUmmcg6FrHMOFBqreEEQoPqjbCMfcA"/>
<button className="absolute top-4 right-4 p-2 bg-[#faf9f9]/80 backdrop-blur rounded-full text-black hover:bg-[#faf9f9]">
<span className="inline-flex items-center justify-center text-lg"><MdFavoriteBorder /></span>
</button>
</div>
<div className="p-6">
<div className="flex items-start justify-between mb-4">
<div>
<h3 className="font-sans text-[24px] leading-[1.4] font-semibold text-black">Porsche 911 Carrera</h3>
<p className="font-sans text-[16px] leading-[1.6] font-normal text-[#444748]">2023</p>
</div>
<span className="font-sans text-[24px] leading-[1.4] font-semibold text-black">₹ 1,75,00,000</span>
</div>
<div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-[#c4c7c7]/30">
<div className="flex items-center gap-2">
<span className="inline-flex items-center justify-center text-[#747878] text-sm"><MdSpeed /></span>
<div className="flex flex-col">
<span className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-[#747878] uppercase text-[10px]">Mileage</span>
<span className="font-sans text-[16px] leading-[1.6] font-normal text-black text-sm font-semibold">12,200 km</span>
</div>
</div>
<div className="flex items-center gap-2">
<span className="inline-flex items-center justify-center text-[#747878] text-sm"><MdLocalGasStation /></span>
<div className="flex flex-col">
<span className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-[#747878] uppercase text-[10px]">Fuel</span>
<span className="font-sans text-[16px] leading-[1.6] font-normal text-black text-sm font-semibold">Petrol</span>
</div>
</div>
<div className="flex items-center gap-2">
<span className="inline-flex items-center justify-center text-[#747878] text-sm"><MdSettings /></span>
<div className="flex flex-col">
<span className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-[#747878] uppercase text-[10px]">Transmission</span>
<span className="font-sans text-[16px] leading-[1.6] font-normal text-black text-sm font-semibold">Automatic</span>
</div>
</div>
<div className="flex items-center gap-2">
<span className="inline-flex items-center justify-center text-[#747878] text-sm"><MdLocationOn /></span>
<div className="flex flex-col">
<span className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-[#747878] uppercase text-[10px]">Location</span>
<span className="font-sans text-[16px] leading-[1.6] font-normal text-black text-sm font-semibold">Mumbai</span>
</div>
</div>
</div>
<button className="w-full border border-primary text-black font-sans text-[12px] leading-none tracking-[0.1em] font-bold uppercase py-3 hover:bg-black hover:text-white transition-colors">View Details</button>
</div>
</article>
{/*Card 3*/}
<article className="group border border-[#c4c7c7]/30 bg-white hover:border-[#747878] transition-colors hidden lg:block">
<div className="relative h-64 overflow-hidden bg-[#e9e8e8]">
<img className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" data-alt="A dark grey Mercedes-Benz G-Class AMG parked against a stark, light-colored architectural concrete background. The vehicle looks commanding and luxurious. High-end automotive photography shot with a long lens to compress the background. Minimalist aesthetic, soft diffused daylight." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAM_80nBB_2a0sSA6WKofQI-SJ6AC7-IifmOTCC_nTFz_6zMIH4-3lknFGOOGbXOBi6L4gcxVQzaWRMKu-XD_QNq-yoJaI98DMHRGeLIvvk80MuxJajcVUAr8QaXqCub7h21eDzT3qh59GG1uqyi1CfwtouI4V1EweFoFyzJRgJqBbmRXWbcPGfv_KnojYIMEtpkhu6g2H7dhwoTwMcWlFysO7Nr-qRrIdlZ9F3VEIOpXFjkjFx95PoSQ"/>
<button className="absolute top-4 right-4 p-2 bg-[#faf9f9]/80 backdrop-blur rounded-full text-black hover:bg-[#faf9f9]">
<span className="inline-flex items-center justify-center text-lg"><MdFavoriteBorder /></span>
</button>
</div>
<div className="p-6">
<div className="flex items-start justify-between mb-4">
<div>
<h3 className="font-sans text-[24px] leading-[1.4] font-semibold text-black">Mercedes AMG G 63</h3>
<p className="font-sans text-[16px] leading-[1.6] font-normal text-[#444748]">2025</p>
</div>
<span className="font-sans text-[24px] leading-[1.4] font-semibold text-black">₹ 3,30,00,000</span>
</div>
<div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-[#c4c7c7]/30">
<div className="flex items-center gap-2">
<span className="inline-flex items-center justify-center text-[#747878] text-sm"><MdSpeed /></span>
<div className="flex flex-col">
<span className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-[#747878] uppercase text-[10px]">Mileage</span>
<span className="font-sans text-[16px] leading-[1.6] font-normal text-black text-sm font-semibold">4,100 km</span>
</div>
</div>
<div className="flex items-center gap-2">
<span className="inline-flex items-center justify-center text-[#747878] text-sm"><MdLocalGasStation /></span>
<div className="flex flex-col">
<span className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-[#747878] uppercase text-[10px]">Fuel</span>
<span className="font-sans text-[16px] leading-[1.6] font-normal text-black text-sm font-semibold">Petrol</span>
</div>
</div>
<div className="flex items-center gap-2">
<span className="inline-flex items-center justify-center text-[#747878] text-sm"><MdSettings /></span>
<div className="flex flex-col">
<span className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-[#747878] uppercase text-[10px]">Transmission</span>
<span className="font-sans text-[16px] leading-[1.6] font-normal text-black text-sm font-semibold">Automatic</span>
</div>
</div>
<div className="flex items-center gap-2">
<span className="inline-flex items-center justify-center text-[#747878] text-sm"><MdLocationOn /></span>
<div className="flex flex-col">
<span className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-[#747878] uppercase text-[10px]">Location</span>
<span className="font-sans text-[16px] leading-[1.6] font-normal text-black text-sm font-semibold">Delhi</span>
</div>
</div>
</div>
<button className="w-full border border-primary text-black font-sans text-[12px] leading-none tracking-[0.1em] font-bold uppercase py-3 hover:bg-black hover:text-white transition-colors">View Details</button>
</div>
</article>
</div>
</section>
{/*3. Discovery Categories*/}
<section className="max-w-[1440px] mx-auto px-5 md:px-16 py-[120px]">
<h2 className="font-sans text-[32px] leading-[1.3] font-semibold text-black mb-12 border-b border-[#c4c7c7]/30 pb-4">Curated Categories</h2>
<div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
<a className="group relative h-48 md:h-64 overflow-hidden bg-[#e9e8e8] block" href="#">
<img className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 opacity-80" data-alt="A close-up abstract detail shot of a luxury SUV's massive alloy wheel and aggressive fender flare. Cinematic, high-contrast lighting with a cool metallic tone. The image is cropped to feel artistic and textural, fitting for a minimalist category thumbnail." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFk3xhxZcux8jeWzV_-LHXTCZzsWgnXAEwkyMHy7pxJU-BnOgrV6mZxxPl2afnD_BDGtpEIAVclKjguEW6AGxMdquP6rhAep5A3iaM3HTuTii-DGnHrde6gkMQEaw_nOfiL2jv9wIz6A4R6gXM674x0I2UfNpiglT51rDufgk5Il4RStHmk9Ciy3Nkv9OOHc9wcLUCQSj2vBItnf-djO4w-JZ6xHFKpyY-A44g_qmyPRl793oCs2Fz0Q"/>
<div className="absolute inset-0 transition-colors duration-300 bg-black/20 group-hover:bg-black/40"></div>
<div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
<span className="font-sans text-[24px] leading-[1.4] font-semibold text-white block">SUVs</span>
<span className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-white/80 uppercase mt-1 block">42 Available</span>
</div>
</a>
<a className="group relative h-48 md:h-64 overflow-hidden bg-[#e9e8e8] block" href="#">
<img className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 opacity-80" data-alt="A sleek profile shot of a luxury sedan in motion against a blurred city background. The focus is sharp on the elegant roofline and chrome accents. Muted, sophisticated color palette with deep blacks and silvers. Editorial style automotive photography." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_8E6ljkoFptLxmmq_YBoyd_RYyf8k80iirgURcmah0A6V84jX3i738dZatrd60VMkeWgDlb_XvqeCIdIBsG3w_KsqPZJv_u6Rn3Zymp_O0skOifjHOnX_pUHJTmXkkEmhpyAv20mkOX6v4rXvU1v1jAEjFrWZlYZ-oLQzzkJT7IwmCS0JHKlCGiVDHPCM6B_dOWVaJgcgD_PQ31ZUK3cB_DLMO1jov3FtSfCT6kohZ6ZIohQudRzCmg"/>
<div className="absolute inset-0 transition-colors duration-300 bg-black/20 group-hover:bg-black/40"></div>
<div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
<span className="font-sans text-[24px] leading-[1.4] font-semibold text-white block">Sedans</span>
<span className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-white/80 uppercase mt-1 block">38 Available</span>
</div>
</a>
<a className="group relative h-48 md:h-64 overflow-hidden bg-[#e9e8e8] block" href="#">
<img className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 opacity-80" data-alt="A macro detail shot of a high-performance sports car's red brake caliper and carbon ceramic disc through intricate spokes. High contrast, technical, and precise aesthetic. Soft studio lighting highlighting the engineering details." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdZMkObND8LxugX9PbiNIyRnO5Efmf0uFhtNtBuAvfz-OCsvE-9hdRg0RVummO_bdq_c0kZskSmdocaz0bdCvUX2acalxIn3XJpbasQ6mjOJM0qMcV1Ah9bhJs23HF4TInCwh-cCAG3VAelCXQDBAMD9tUz6s4cmK0fMtjGAcGf-SX-zxZfCIRzO7BdnQuSXf3PZsWgFMGpusgUgh0rMCQqG6CQSjQGRKL2QES1jdtRmx4PTw3JKUrlg"/>
<div className="absolute inset-0 transition-colors duration-300 bg-black/20 group-hover:bg-black/40"></div>
<div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
<span className="font-sans text-[24px] leading-[1.4] font-semibold text-white block">Sports</span>
<span className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-white/80 uppercase mt-1 block">15 Available</span>
</div>
</a>
<a className="group relative h-48 md:h-64 overflow-hidden bg-[#e9e8e8] block" href="#">
<img className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 opacity-80" data-alt="A detail shot of an electric vehicle's futuristic charging port glowing with a subtle blue light against stark white body panels. Clean, clinical, and highly modern aesthetic representing sustainable luxury. Minimalist composition." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnvTU0PKiQ4nuCAzjmryseR2RwVXjzIXSA-viQUiPLjvQXAZGrQUs-aVZi1LOSi5vyWMdJq7u1HBJHTCt0oanquNDuQWfQCyI44lu0I299xdMZzJP0D67oLZZ-Qx282B7dAFmo-d8ZRiHn_MkPLMzdvGp4W-msdoyZVhYsx8XPnq_iRy5OlBFsSrE5JukdLIRq11dpdOe3FSduCC6suwgCBR2FWgZXpVUEzDEz8zXC-Kgjzjr3V_UzTw"/>
<div className="absolute inset-0 transition-colors duration-300 bg-black/20 group-hover:bg-black/40"></div>
<div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
<span className="font-sans text-[24px] leading-[1.4] font-semibold text-white block">Electric</span>
<span className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-white/80 uppercase mt-1 block">24 Available</span>
</div>
</a>
</div>
</section>
{/*4. Built For Trust*/}
<section className="border-y border-[#c4c7c7]/30 bg-[#f4f3f3]">
<div className="max-w-[1440px] mx-auto px-5 md:px-16 py-16">
<div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4 md:gap-8 md:text-left">
<div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
<span className="inline-flex items-center justify-center text-3xl text-[#747878] mb-2 md:mb-0"><MdVerified /></span>
<div>
<h4 className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-black uppercase mb-2">Verified Listings</h4>
<p className="font-sans text-[16px] leading-[1.6] font-normal text-[#444748] text-sm">Rigorous 150-point technical inspection for every vehicle.</p>
</div>
</div>
<div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
<span className="inline-flex items-center justify-center text-3xl text-[#747878] mb-2 md:mb-0"><MdDiamond /></span>
<div>
<h4 className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-black uppercase mb-2">Luxury Experience</h4>
<p className="font-sans text-[16px] leading-[1.6] font-normal text-[#444748] text-sm">White-glove delivery and dedicated concierge service.</p>
</div>
</div>
<div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
<span className="inline-flex items-center justify-center text-3xl text-[#747878] mb-2 md:mb-0"><MdHandshake /></span>
<div>
<h4 className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-black uppercase mb-2">Trusted Network</h4>
<p className="font-sans text-[16px] leading-[1.6] font-normal text-[#444748] text-sm">Exclusive partnerships with elite international dealers.</p>
</div>
</div>
<div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
<span className="inline-flex items-center justify-center text-3xl text-[#747878] mb-2 md:mb-0"><MdAccountBalance /></span>
<div>
<h4 className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-black uppercase mb-2">Bespoke Finance</h4>
<p className="font-sans text-[16px] leading-[1.6] font-normal text-[#444748] text-sm">Tailored financial structures for discerning collectors.</p>
</div>
</div>
</div>
</div>
</section>
{/*5. Brand Story*/}
<section className="max-w-[1440px] mx-auto px-5 md:px-16 py-[120px]">
<div className="grid items-center gap-12 md:grid-cols-2 md:gap-24">
<div className="relative h-[512px] md:h-[716px] bg-[#e9e8e8] order-2 md:order-1">
<img className="object-cover w-full h-full" data-alt="An abstract, architectural interior shot of the Wish Wheels private gallery space. Minimalist concrete columns, perfect dramatic spotlighting, and the subtle blurred reflection of a classic car in the polished floor. The mood is silent, exclusive, and undeniably premium. Light-mode aesthetic with strong geometric shadows." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUe5Fw_TSvvWxTnEYGQUY8Ltk9X1DW_Dk6xiFMaXHrstyOSpCmDX3dApPfMb_aFXCvBlcSlkXniCOg3Ft2Du6uPgaQjncM8UCsu7olX7sojsUb-96Umf-ZzuDnvWQQQIS2gXDu4OJ11tcjdHyyz8ZpVTJQj3koPy4IP5ngSS1daU3P3SPk8HEBHfvNGpRctjgjB6LKEW-th5o8NzOCElAGF5xJB_mAD0HUVpUXV72VwbbTB-y6py8FrQ"/>
</div>
<div className="order-1 md:order-2">
<h2 className="font-sans md:font-sans text-[40px] leading-[1.2] tracking-[-0.01em] font-bold md:text-[64px] md:leading-[1.1] md:tracking-[-0.02em] md:font-bold text-black mb-8">The Future of Premium Acquisition</h2>
<p className="font-sans text-[18px] leading-[1.6] font-normal text-[#444748] mb-8">
                        Wish Wheels exists at the intersection of mechanical art and modern commerce. We curate an exclusive portfolio of exceptional motorcars, presenting them in a digital gallery designed for the most discerning automotive enthusiasts. Transparency, authenticity, and an uncompromising commitment to quality define our methodology.
                    </p>
<ul className="space-y-4 font-sans text-[16px] leading-[1.6] font-normal text-black">
<li className="flex items-center gap-3">
<span className="inline-flex items-center justify-center text-[#747878]"><MdCheck /></span>
                            Curated provenance for every machine.
                        </li>
<li className="flex items-center gap-3">
<span className="inline-flex items-center justify-center text-[#747878]"><MdCheck /></span>
                            Transparent, direct-to-market pricing structures.
                        </li>
<li className="flex items-center gap-3">
<span className="inline-flex items-center justify-center text-[#747878]"><MdCheck /></span>
                            Global logistics and secured transport.
                        </li>
</ul>
<button className="mt-10 border-b border-primary text-black font-sans text-[12px] leading-none tracking-[0.1em] font-bold uppercase pb-1 hover:text-[#747878] hover:border-[#747878] transition-colors">Read Our Story</button>
</div>
</div>
</section>
</main>
{/*Footer Component from JSON*/}
<footer className="bg-[#faf9f9] dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#f1f0f0] font-sans text-[16px] leading-[1.6] font-normal border-t border-[#c4c7c7]/50">
<div className="max-w-[1440px] mx-auto px-5 md:px-16 py-[120px] grid grid-cols-1 md:grid-cols-4 gap-8">
{/*Brand Column*/}
<div className="flex flex-col space-y-4 md:col-span-1">
<span className="font-sans text-[32px] leading-[1.3] font-semibold font-bold text-black dark:text-[#e5e2e1]">Wish Wheels</span>
<p className="text-[#444748] dark:text-[#747878] text-sm">The Private Gallery for Exceptional Motors.</p>
<p className="text-[#444748] dark:text-[#747878] text-sm mt-auto pt-8">© 2024 Wish Wheels.</p>
</div>
{/*Links Column 1*/}
<div className="flex flex-col space-y-4">
<h4 className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-black uppercase tracking-widest mb-2">Explore</h4>
<a className="text-[#444748] dark:text-[#747878] hover:text-black dark:hover:text-[#e5e2e1] underline decoration-1 underline-offset-4 transition-colors" href="#">The Collection</a>
<a className="text-[#444748] dark:text-[#747878] hover:text-black dark:hover:text-[#e5e2e1] underline decoration-1 underline-offset-4 transition-colors" href="#">Sell with Us</a>
</div>
{/*Links Column 2*/}
<div className="flex flex-col space-y-4">
<h4 className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-black uppercase tracking-widest mb-2">About</h4>
<a className="text-[#444748] dark:text-[#747878] hover:text-black dark:hover:text-[#e5e2e1] underline decoration-1 underline-offset-4 transition-colors" href="#">Our Story</a>
<a className="text-[#444748] dark:text-[#747878] hover:text-black dark:hover:text-[#e5e2e1] underline decoration-1 underline-offset-4 transition-colors" href="#">Journal</a>
</div>
{/*Links Column 3*/}
<div className="flex flex-col space-y-4">
<h4 className="font-sans text-[12px] leading-none tracking-[0.1em] font-bold text-black uppercase tracking-widest mb-2">Legal</h4>
<a className="text-[#444748] dark:text-[#747878] hover:text-black dark:hover:text-[#e5e2e1] underline decoration-1 underline-offset-4 transition-colors" href="#">Terms of Service</a>
<a className="text-[#444748] dark:text-[#747878] hover:text-black dark:hover:text-[#e5e2e1] underline decoration-1 underline-offset-4 transition-colors" href="#">Privacy Policy</a>
</div>
</div>
</footer>
    </div>
  );
}
