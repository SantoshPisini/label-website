import { Divider } from "@nextui-org/react";
import Header from "./components/Header";
import LabelForm from "./components/LabelForm";
import { useEffect, useState } from "react";
import { LabelModel, defaultLabelModel } from "./types";
import ListSection from "./components/ListSection";

function Popup() {
  const [userConfig, setUserConfig] = useState<LabelModel[]>([]);
  const [item, setItem] = useState<LabelModel>(defaultLabelModel);

  async function fetchConfig() {
    chrome.storage.sync.get(["LABEL_WEBSITE"]).then((result) => {
      setUserConfig(result.LABEL_WEBSITE);
    });
  }

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <div className="m-4 px-1 flex flex-col gap-2 min-w-[500px]">
      <Header />
      <Divider />
      <LabelForm isChanged={() => fetchConfig()} item={item} />
      <Divider />
      <Divider />
      <ListSection
        config={userConfig}
        isChanged={() => fetchConfig()}
        isEditing={setItem}
      />
    </div>
  );
}

export default Popup;
