import React from "react";
import Slider from "@mui/material/Slider";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "./SignDistributionFilter.css";

type Sign = "1" | "X" | "2";

type Props = {
    ranges: Record<Sign, [number, number]>;
    onChange: React.Dispatch<
        React.SetStateAction<Record<Sign, [number, number]>>
    >;
};

const SIGN_COLORS: Record<Sign, string> = {
    "1": "#2ecc71",
    "X": "#f1c40f",
    "2": "#e74c3c",
};

const MIN = 0;
const MAX = 13;

export default function SignDistributionFilter({ ranges, onChange }: Props) {
    const [activeSign, setActiveSign] = React.useState<Sign | null>(null);
    const [open, setOpen] = React.useState(false);

    function openModal(sign: Sign) {
        setActiveSign(sign);
        setOpen(true);
    }

    function closeModal() {
        setOpen(false);
        setActiveSign(null);
    }

    function handleSliderChange(_: Event, value: number | number[]) {
        if (!activeSign || !Array.isArray(value)) return;

        onChange(prev => ({
            ...prev,
            [activeSign]: value as [number, number],
        }));
    }


    return (
        <div className="sign-filter">
            <div className="sign-buttons">
                {(["1", "X", "2"] as Sign[]).map(sign => {
                    const [min, max] = ranges[sign];

                    return (
                        <button
                            key={sign}
                            className="sign-button"
                            style={{
                                borderColor: SIGN_COLORS[sign],
                                color: SIGN_COLORS[sign],
                            }}
                            onClick={() => openModal(sign)}
                        >
                            {sign}
                            <span className="range-label">
                                {min}-{max}
                            </span>
                        </button>
                    );
                })}
            </div>

            <Modal open={open} onClose={closeModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 320,
                        borderRadius: 3,
                        p: 3,

                        background: "rgba(104, 96, 125, 0.65)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",

                        boxShadow: "0 20px 50px rgba(30, 64, 175, 0.25)",
                    }}
                >

                    {activeSign && (
                        <>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginBottom: 16,
                                }}
                            >
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "50%",
                                        border: `3px solid ${SIGN_COLORS[activeSign]}`,
                                        color: SIGN_COLORS[activeSign],
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 20,
                                        fontWeight: 600,
                                        background: "rgba(35, 30, 30, 0.6)",
                                        boxShadow: `0 4px 14px ${SIGN_COLORS[activeSign]}33`,
                                    }}
                                >
                                    {activeSign}
                                </div>
                            </div>

                            <Slider
                                value={ranges[activeSign]}
                                onChange={handleSliderChange}
                                min={MIN}
                                max={MAX}
                                valueLabelDisplay="auto"
                                disableSwap
                                sx={{
                                    height: 10,


                                    "& .MuiSlider-rail": {
                                        opacity: 1,
                                        backgroundColor: "#e5e7eb",
                                        borderRadius: 999,
                                    },

                                    "& .MuiSlider-track": {
                                        border: "none",
                                        borderRadius: 999,
                                        background: `linear-gradient(90deg, ${SIGN_COLORS[activeSign]}88, ${SIGN_COLORS[activeSign]})`,
                                    },

                                    "& .MuiSlider-thumb": {
                                        width: 22,
                                        height: 22,
                                        backgroundColor: "#fff",
                                        border: `3px solid ${SIGN_COLORS[activeSign]}`,
                                        boxShadow: `0 4px 12px ${SIGN_COLORS[activeSign]}55`,

                                        "&:hover": {
                                            boxShadow: `0 0 0 8px ${SIGN_COLORS[activeSign]}22`,
                                        },

                                        "&.Mui-active": {
                                            boxShadow: `0 0 0 10px ${SIGN_COLORS[activeSign]}33`,
                                        },
                                    },

                                    "& .MuiSlider-valueLabel": {
                                        background: SIGN_COLORS[activeSign],
                                        borderRadius: 6,
                                        fontSize: 12,
                                        fontWeight: 500,
                                    },
                                }}
                            />

                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
}
