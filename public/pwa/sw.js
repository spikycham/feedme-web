self.addEventListener("push", (e) => {
    const data = e.data?.json() ?? {};

    e.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: "/pwa/icon-192.svg",
        }),
    );
});
