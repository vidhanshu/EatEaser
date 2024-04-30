import PageMeta from "@src/common/components/page-meta";
import { PAGES } from "@src/common/utils/pages";
import { OfferCard } from "@src/menu/pages/menu-page";
import { PROMOTIONAL_CARDS } from "@src/menu/utils/constants";

const OffersPage = () => {
  return (
    <main className="space-y-4 px-4 pt-8">
      <PageMeta title={PAGES.OffersPage.title} description={PAGES.OffersPage.description} />
      {PROMOTIONAL_CARDS.map(({ title, description, img, bgImg }, i) => (
        <OfferCard key={i} title={title} description={description} img={img} bgImg={bgImg} />
      ))}
    </main>
  );
};

export default OffersPage;
