import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

//传参数接口属性
export interface LinkStyleProps extends LinkProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * LinkStyle 组件
 * @param href - 链接地址
 * @param children - 链接内容
 * @param className - 自定义样式
 * @returns 
 */
export const LinkStyle = ({ href, children, className }: LinkStyleProps) => {
    const baseClasses = "block bg-purple-200 text-black hover:bg-purple-300 px-4 py-2 rounded-md text-center transition-colors";
    const combinedClasses = `${baseClasses} ${className || ""}`;
    return (
        <Link href={href} className={combinedClasses}>{children}</Link>
    );
}