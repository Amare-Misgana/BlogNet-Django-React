import styles from "./Home.module.css";
import HomeNav from "../../components/HomeNav/HomeNav";
import FoodVisual from "../../assets/Hamburger.gif";
import EduVisual from "../../assets/Learning.gif";
import TechVisual from "../../assets/Robotarm.gif";
import FoodShowCase from "../../assets/food.png";
import TechShowCase from "../../assets/tech.png";
import EduShowCase from "../../assets/edu.png";
import { useEffect, useRef } from "react";

const Home = ({ interval = 6000 }) => {
    // const btnRef = useRef();
    const imgRef = useRef();
    const showCaseRef = useRef();
    const navRef = useRef();
    const btnRef = useRef();
    

    const states = [
        { visualSrc: TechVisual, showCaseSrc: TechShowCase, color: "#407BFF" },
        { visualSrc: EduVisual, showCaseSrc: EduShowCase, color: "#5BEA84" },
        { visualSrc: FoodVisual, showCaseSrc: FoodShowCase, color: "#FF725E" },
    ];

    useEffect(() => {
        let idx = 0;
        const timer = setInterval(() => {
            const { visualSrc, showCaseSrc, color } = states[idx];

            if (showCaseRef.current) {
                showCaseRef.current.classList.remove(styles.animateSlide);
                showCaseRef.current.classList.add(styles.animateOut);
                setTimeout(() => {
                    showCaseRef.current.classList.remove(styles.animateOut);
                    showCaseRef.current.classList.add(styles.animateSlide);
                    showCaseRef.current.src = showCaseSrc;
                }, 400);
            }

            if (imgRef.current) {
                imgRef.current.src = visualSrc;
            }

            if (btnRef.current) {
                btnRef.current.style.setProperty("background-color", color, "important");
            }

            if (navRef.current) {
                navRef.current.style.backgroundColor = color;
            }

            idx = (idx + 1) % states.length;
        }, interval);

        return () => clearInterval(timer);
    }, [interval]);

    return (
        <div className={styles.HomeContainer}>
            <HomeNav navRef={navRef} />
            <div className={styles.hero}>
                <div className={styles.text}>
                    <h1>Write freely, share openly, grow daily.</h1>
                    <p>A platform to express yourself and connect with others easily.</p>
                    <button ref={btnRef}>Create Your Blog</button>
                </div>
                <div className={styles.visual}>
                    <img src={FoodVisual} alt="Visual" ref={imgRef} />
                </div>
                <img
                    src={FoodShowCase}
                    alt="Showcase"
                    ref={showCaseRef}
                    className={`${styles.animateSlide} ${styles.imgVisual}`}
                />
            </div>
        </div>
    );
};

export default Home;
