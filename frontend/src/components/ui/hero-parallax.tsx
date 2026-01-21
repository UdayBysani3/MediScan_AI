"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const HeroParallax = ({
    products,
}: {
    products: {
        title: string;
        link: string;
        thumbnail: string;
    }[];
}) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

    const translateX = useTransform(scrollYProgress, [0, 1], [0, 1000]);
    const translateXReverse = useTransform(scrollYProgress, [0, 1], [0, -1000]);
    const rotateX = useTransform(scrollYProgress, [0, 0.2], [15, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.2], [0.2, 1]);
    const rotateZ = useTransform(scrollYProgress, [0, 0.2], [20, 0]);
    const translateY = useTransform(scrollYProgress, [0, 0.2], [-700, 500]);

    return (
        <div
            ref={ref}
            className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
        >
            <Header />
            <motion.div
                style={{
                    rotateX,
                    rotateZ,
                    translateY,
                    opacity,
                }}
                className=""
            >
                <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
                    {products.slice(0, 5).map((product) => (
                        <ProductCard product={product} translate={translateX} key={product.title} />
                    ))}
                </motion.div>
                <motion.div className="flex flex-row mb-20 space-x-20">
                    {products.slice(5, 10).map((product) => (
                        <ProductCard product={product} translate={translateXReverse} key={product.title} />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export const Header = () => {
    return (
        <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
            <h1 className="text-2xl md:text-7xl font-bold dark:text-white">
                The Ultimate <br /> AI Medical Platform
            </h1>
            <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">
                We build beautiful products with the latest technologies and frameworks.
            </p>
        </div>
    );
};

export const ProductCard = ({
    product,
    translate,
}: {
    product: {
        title: string;
        link: string;
        thumbnail: string;
    };
    translate: any;
}) => {
    return (
        <motion.div
            style={{
                x: translate,
            }}
            whileHover={{
                y: -20,
            }}
            className="group/product h-96 w-[30rem] relative flex-shrink-0"
        >
            <div className="block group-hover/product:shadow-2xl">
                <img
                    src={product.thumbnail}
                    height="600"
                    width="600"
                    className="object-cover object-left-top absolute h-full w-full inset-0"
                    alt={product.title}
                />
            </div>
            <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
            <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
                {product.title}
            </h2>
        </motion.div>
    );
};
