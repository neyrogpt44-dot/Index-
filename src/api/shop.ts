export interface ProductVariant {
    id: string;
    price: string;
    img: string;
    sizes: string[];
}

export interface ProductGroup {
    name: string;
    vendor: string;
    description: string;
    colors: Record<string, ProductVariant>; // Группировка: Картинка = Цвет
}

export const fetchInventory = async (): Promise<ProductGroup[]> => {
    // Здесь укажи путь к твоему XML. Если он лежит локально в public, то '/feed.xml'
    const response = await fetch('/api/get'); 
    const text = await response.text();
    const xml = new DOMParser().parseFromString(text, "text/xml");
    const offers = Array.from(xml.querySelectorAll("offer"));

    const grouped: Record<string, ProductGroup> = {};

    offers.forEach(el => {
        const fullName = el.querySelector("name")?.textContent || "";
        // Группируем по имени до скобок (чтобы Nike Air (Red) и Nike Air (Black) стали одной карточкой)
        const baseName = fullName.split('(')[0].trim();
        const img = el.querySelector("picture")?.textContent || "";
        const size = el.querySelector('param[name="Размер"]')?.textContent || "EU";

        if (!grouped[baseName]) {
            grouped[baseName] = {
                name: baseName,
                vendor: el.querySelector("vendor")?.textContent || "Бренд",
                description: el.querySelector("description")?.textContent || "",
                colors: {}
            };
        }

        if (!grouped[baseName].colors[img]) {
            grouped[baseName].colors[img] = {
                id: el.getAttribute('id') || "",
                price: el.querySelector("price")?.textContent || "0",
                img: img,
                sizes: []
            };
        }

        if (!grouped[baseName].colors[img].sizes.includes(size)) {
            grouped[baseName].colors[img].sizes.push(size);
        }
    });

    return Object.values(grouped);
};
