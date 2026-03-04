"use client";

interface Props {
    label: string;
    value: string | number;
    subLabel?: string;
    icon: string;
    accentColor?: string;
    trend?: "up" | "down" | "neutral";
    delay?: number;
}

export default function MetricCard({
    label,
    value,
    subLabel,
    icon,
    accentColor = "var(--violet-500)",
    trend,
    delay = 0,
}: Props) {
    const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : null;
    const trendColor = trend === "up" ? "var(--green)" : trend === "down" ? "var(--red)" : "var(--text-muted)";

    return (
        <div
            className={`card animate-fade-in-up delay-${delay}`}
            style={{ padding: "20px 22px", position: "relative", overflow: "hidden" }}
        >
            {/* Accent glow top border */}
            <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: "2px",
                background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            }} />

            {/* Label row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {label}
                </p>
                <span style={{ fontSize: "18px" }}>{icon}</span>
            </div>

            {/* Value */}
            <p style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.2,
                marginBottom: subLabel ? "6px" : 0,
            }}>
                {value}
                {trendIcon && (
                    <span style={{ fontSize: "14px", color: trendColor, marginLeft: "6px" }}>
                        {trendIcon}
                    </span>
                )}
            </p>

            {/* SubLabel */}
            {subLabel && (
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {subLabel}
                </p>
            )}
        </div>
    );
}
