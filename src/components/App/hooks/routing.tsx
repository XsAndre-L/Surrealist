import { useLayoutEffect } from "react";
import { useLocation } from "wouter";
import { useCloudRoute } from "~/hooks/cloud";
import { useSearchParams } from "~/hooks/routing";
import { useConfigStore } from "~/stores/config";
import { handleIntentRequest } from "~/util/intents";
import { REFERRER_KEY } from "~/util/storage";

export function useAppRouter() {
	const { setActiveResource, setActiveScreen } = useConfigStore.getState();

	const [path, setPath] = useLocation();
	const { intent, referrer } = useSearchParams();
	const isCloud = useCloudRoute();
	const resource = useConfigStore((s) => s.activeResource);
	const screen = useConfigStore((s) => s.activeScreen);

	// Restore active resource
	useLayoutEffect(() => {
		if (path === "/") {
			console.log("resource", resource || "/query");
			setPath(resource || "/query");
		} else {
			setActiveResource(path);
		}
	}, [path, resource, setActiveResource]);

	// Handle intent requests
	useLayoutEffect(() => {
		if (intent) {
			setPath(path, { replace: true });
			handleIntentRequest(intent);
		}
	}, [intent, path]);

	// Skip cloud screen
	useLayoutEffect(() => {
		if (screen === "start" && isCloud) {
			setActiveScreen("database");
		}
	}, [screen, isCloud, setActiveScreen]);

	// Cloud referral codes
	useLayoutEffect(() => {
		if (referrer) {
			sessionStorage.setItem(REFERRER_KEY, referrer);
		}
	}, [referrer]);
}
