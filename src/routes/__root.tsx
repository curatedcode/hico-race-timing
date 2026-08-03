import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { ErrorComponent } from "#/components/error-component";
import { Footer } from "#/components/footer";
import { Navbar } from "#/components/navbar";
import { NotFoundComponent } from "#/components/not-found-component";
import { Toaster } from "#/components/ui/toast";
import type { AppRouter } from "#/server/api/root";
import appCss from "../styles/global.css?url";

interface MyRouterContext {
	queryClient: QueryClient;

	trpc: TRPCOptionsProxy<AppRouter>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{ title: "HiCo Race Timing" },
			{
				name: "description",
				content:
					"Professional chip timing and fast, accurate results for races of any size.",
			},
			{ name: "robots", content: "index, follow" },
			{ name: "format-detection", content: "telephone=no" },
			{ name: "author", content: "HiCo Race Timing" },
			{ property: "og:site_name", content: "HiCo Race Timing" },
			{ property: "og:type", content: "website" },
			{
				property: "og:image",
				content:
					"https://hicoracetiming.zackaryf.com/assets/images/social/og-default.png",
			},
			{ name: "og:url", content: "https://hicoracetiming.zackaryf.com/" },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:url", content: "https://hicoracetiming.zackaryf.com/" },
			{
				name: "twitter:image",
				content:
					"https://hicoracetiming.zackaryf.com/assets/images/social/og-default.png",
			},
			{ name: "theme-color", content: "#3a312a" },
			{ name: "mobile-web-app-capable", content: "yes" },
			{ name: "apple-mobile-web-app-capable", content: "yes" },
			{ name: "apple-mobile-web-app-status-bar-style", content: "default" },
			{ name: "apple-mobile-web-app-title", content: "HiCo" },
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{ rel: "icon", href: "/favicon.ico", sizes: "32x32" },
			{
				rel: "icon",
				href: "/assets/images/logos/favicon-16x16.png",
				type: "image/png",
				sizes: "16x16",
			},
			{
				rel: "icon",
				href: "/assets/images/logos/favicon-32x32.png",
				type: "image/png",
				sizes: "32x32",
			},
			{
				rel: "apple-touch-icon",
				href: "/assets/images/logos/apple-touch-icon.png",
				sizes: "180x180",
			},
			{ rel: "manifest", href: "/site.webmanifest" },
		],
	}),
	shellComponent: RootDocument,
	errorComponent: ErrorComponent,
	notFoundComponent: NotFoundComponent,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="bg-background text-foreground">
				<Navbar />
				{children}
				<Toaster />
				<Footer />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						{
							name: "Tanstack Query",
							render: <ReactQueryDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
