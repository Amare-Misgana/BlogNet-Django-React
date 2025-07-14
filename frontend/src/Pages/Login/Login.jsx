import React, { useRef, useState, useEffect } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import FoodVisual from "../../assets/Hamburger.gif";
import EduVisual from "../../assets/Learning.gif";
import TechVisual from "../../assets/Robotarm.gif"; // make sure this filename matches
import { MdErrorOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import HomeNav from "../../components/HomeNav/HomeNav";

const Login = ({ interval = 5000 }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const imgRef = useRef();
    const formHeaderRef = useRef();
    const btnRef = useRef();
    const emailError = useRef();
    const passwordError = useRef();
    const navRef = useRef(); // only if HomeNav actually uses it
    const navigate = useNavigate();

    const states = [
        { visualSrc: TechVisual, color: "#407BFF" },
        { visualSrc: EduVisual, color: "#5BEA84" },
        { visualSrc: FoodVisual, color: "#FF725E" },
    ];

    useEffect(() => {
        let idx = 0;
        const timer = setInterval(() => {
            const { visualSrc, color } = states[idx];

            // outline inputs
            document.querySelectorAll("input").forEach((inp) => {
                inp.style.outlineColor = color;
            });

            // button text color

            btnRef.current.style.setProperty("background-color", color, "important");

            // button text color
            if (formHeaderRef.current) {
                formHeaderRef.current.style.color = color;
            }

            // rotating visual
            if (imgRef.current) {
                imgRef.current.src = visualSrc;
            }

            // nav background (if used)
            if (navRef.current) {
                navRef.current.style.backgroundColor = color;
            }

            idx = (idx + 1) % states.length;
        }, interval);

        return () => clearInterval(timer);
    }, [interval, states]);

    const handelSubmit = (e) => {
        e.preventDefault();
        axios
            .post("http://127.0.0.1:8000/api/login/", { email, password })
            .then((res) => {
                if (res.data.access) {
                    localStorage.setItem("access", res.data.access);
                }
                if (res.data.refresh) {
                    localStorage.setItem("refresh", res.data.refresh);
                }
                navigate("/blog");
            })
            .catch((err) => {
                console.log(err);
                const msg = err.response.data.errors;
                const errors = Object.keys(msg);
                let msgKeys = Object.keys(msg);

                if (errors.length > 0) {
                    if (msgKeys.includes("email")) {
                        emailError.current.style.visibility = "visible";
                    }
                    if (msgKeys.includes("password")) {
                        passwordError.current.style.visibility = "visible";
                    }

                    for (let i = 0; i < msgKeys.length; i++) {
                        for (let j = 0; j < msg[msgKeys[i]].length; j++) {
                            if (j == 0) {
                                document.getElementById(`${msgKeys[i]}Error`).innerHTML = "&nbsp";
                            }
                            document.getElementById(`${msgKeys[i]}Error`).innerHTML += `${msg[msgKeys[i]][j]}`;
                        }
                    }
                }
                const fields = ["email", "password"];
                for (let i = 0; i < fields.length; i++) {
                    document.getElementById(fields[i]).classList.remove(styles.error);
                    document.getElementById(fields[i]).classList.remove(styles.success);
                }
                for (let i = 0; i < errors.length; i++) {
                    document.getElementById(errors[i]).classList.add(styles.error);
                }
                for (let i = 0; i < fields.length; i++) {
                    if (!errors.includes(fields[i])) {
                        document.getElementById(`${fields[i]}Error`).innerHTML = "&nbsp";
                    }
                }
            });
    };
    const handelEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const handelPasswordChange = (e) => {
        setPassword(e.target.value);
    };
    return (
        <div className={styles.LoginContainer}>
            <HomeNav currentPage="signIn" isHomePage={false} navRef={navRef} />
            <div className={styles.formContainer}>
                <form onSubmit={handelSubmit} className={styles.form}>
                    <h1 ref={formHeaderRef} className={styles.h1}>
                        Sign In
                    </h1>

                    <label htmlFor="email">
                        <input
                            className={styles.input}
                            type="email"
                            autoComplete="off"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={handelEmailChange}
                        />
                        <span className={styles.errorMessage} id="emailError" ref={emailError}>
                            &nbsp;
                        </span>
                    </label>
                    <label htmlFor="password">
                        <input
                            className={styles.input}
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={handelPasswordChange}
                        />
                        <span className={styles.errorMessage} id="passwordError" ref={passwordError}>
                            &nbsp;
                        </span>
                    </label>
                    <button
                        type="submit"
                        ref={btnRef}
                        className={styles.subBtn}
                        disabled={email == "" || password == ""}
                        title={btnRef.current ? (btnRef.current.disabled ? "Disabled" : "") : ""}
                    >
                        Sign In
                    </button>
                    <p className={styles.p}>
                        Don't have account yet? Sign Up{" "}
                        <Link className={styles.a} to="/register">
                            here
                        </Link>{" "}
                    </p>
                </form>
                <div className={styles.visual}>
                    <img src={FoodVisual} alt="Visual" ref={imgRef} />
                </div>
            </div>
        </div>
    );
};

export default Login;
