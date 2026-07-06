import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useScrollAnimations(enabled = true) {
  useLayoutEffect(() => {
    if (!enabled) return;

    const ctx = gsap.context(() => {
    const sections = gsap.utils.toArray(".slider section");

    gsap.set(sections, {
        xPercent:(i)=>i===0?0:100
    });

    const tl = gsap.timeline({
        scrollTrigger:{
            trigger:".slider",
            pin:true,
            scrub:1,
            end:`+=${sections.length*1000}`
        }
    });

    sections.forEach((section,i)=>{

        if(i===0) return;

        tl.to(sections[i-1],{
            xPercent:-100
        });

        tl.to(section,{
            xPercent:0
        },"<");

    });
    });

    return () => {
      ctx.revert();
    };
  }, [enabled]);
}