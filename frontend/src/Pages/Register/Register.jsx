import { useRef, useState, useEffect } from "react";
import styles from "./Register.module.css";
import axios from "axios";
import FoodVisual from "../../assets/Hamburger.gif";
import EduVisual from "../../assets/Learning.gif";
import TechVisual from "../../assets/Robotarm.gif";
import { Link, useNavigate } from "react-router-dom";
import HomeNav from "../../components/HomeNav/HomeNav";

const Register = ({ interval = 5000 }) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const emailError = useRef();
    const usernameError = useRef();
    const passwordError = useRef();

    const imgRef = useRef();
    const navRef = useRef();
    const btnRef = useRef();
    const formHeaderRef = useRef();

    const states = [
        { visualSrc: TechVisual, color: "#407BFF" },
        { visualSrc: EduVisual, color: "#5BEA84" },
        { visualSrc: FoodVisual, color: "#FF725E" },
    ];

    useEffect(() => {
        let idx = 0;
        const timer = setInterval(() => {
            const { visualSrc, color } = states[idx];

            document.querySelectorAll("input").forEach((inp) => {
                inp.style.outlineColor = color;
            });

            if (formHeaderRef.current) {
                formHeaderRef.current.style.color = color;
            }

            btnRef.current.style.setProperty("background-color", color, "important");

            if (imgRef.current) {
                imgRef.current.src = visualSrc;
            }

            if (navRef.current) {
                navRef.current.style.backgroundColor = color;
            }

            idx = (idx + 1) % states.length;
        }, interval);

        return () => clearInterval(timer);
    }, [interval]);

    const nav = useNavigate();

    const handelSubmit = (e) => {
        e.preventDefault();
        axios
            .post("http://127.0.0.1:8000/api/register/", {
                username: username,
                email: email,
                password: password,
            })
            .then((res) => {
                console.log(res);
                nav("/login");
            })
            .catch((err) => {
                console.log(err);
                const msg = err.response.data.errors;
                const errors = Object.keys(msg);
                let msgKeys = Object.keys(msg);

                console.log(msgKeys.includes("email"));
                console.log(document.getElementById("emailError"));

                if (errors.length > 0) {
                    console.log("hi");
                    console.log(msgKeys);
                    console.log(msgKeys.includes("email"));
                    if (msgKeys.includes("email")) {
                        emailError.current.style.visibility = "visible";
                    }
                    if (msgKeys.includes("password")) {
                        passwordError.current.style.visibility = "visible";
                    }
                    if (msgKeys.includes("username")) {
                        usernameError.current.style.visibility = "visible";
                    }

                    for (let i = 0; i < msgKeys.length; i++) {
                        for (let j = 0; j < msg[msgKeys[i]].length; j++) {
                            if (j == 0) {
                                document.getElementById(`${msgKeys[i]}Error`).innerHTML = "&nbsp";
                            }
                            document.getElementById(`${msgKeys[i]}Error`).innerHTML += `${msg[msgKeys[i]][j]} <br>`;
                        }
                    }
                }
                const fields = ["username", "email", "password"];
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
    const handelUsernameChange = (e) => {
        setUsername(e.target.value);
    };
    const handelPasswordChange = (e) => {
        setPassword(e.target.value);
    };

    return (
        <div className={styles.RegisterContainer}>
            <HomeNav currentPage="signUp" isHomePage={false} navRef={navRef} />
            <div className={styles.formContainer}>
                <form action="" onSubmit={handelSubmit} className={styles.form}>
                    <h1 ref={formHeaderRef} className={styles.h1}>
                        Sign Up
                    </h1>
                    <label htmlFor="username">
                        <input
                            className={styles.input}
                            type="text"
                            id="username"
                            autoComplete="off"
                            placeholder="Username"
                            value={username}
                            onChange={handelUsernameChange}
                        />
                        <div className={styles.arrow}></div>
                        <span className={styles.errorMessage} id="usernameError" ref={usernameError}>
                            &nbsp;
                        </span>
                    </label>
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
                        disabled={email == "" || password == "" || username == ""}
                        title={btnRef.current ? (btnRef.current.disabled ? "Disabled" : "") : ""}
                    >
                        Sign Up
                    </button>
                    <p className={styles.p}>
                        Already have an account? Sign In{" "}
                        <Link className={styles.a} to="/login">
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

export default Register;
