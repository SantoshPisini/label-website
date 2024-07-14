import { Button, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { LabelModel, defaultLabelModel } from "../types";

export default function LabelForm(props: {
  isChanged: () => void;
  item: LabelModel;
}) {
  const [url, setUrl] = useState(defaultLabelModel.url);
  const [label, setLabel] = useState(defaultLabelModel.label);
  const [labelColor, setLabelColor] = useState(defaultLabelModel.labelColor);
  const [textColor, setTextColor] = useState(defaultLabelModel.textColor);

  useEffect(() => {
    if (props.item.url === "") {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs) {
          setUrl(tabs[0].url ?? "");
        }
      });
    } else {
      setUrl(props.item.url);
      setLabel(props.item.label);
      setLabelColor(props.item.labelColor);
      setTextColor(props.item.textColor);
    }
  }, [props.item]);

  const save = () => {
    const config = {
      url: url,
      label: label,
      labelColor: labelColor,
      textColor: textColor,
    };

    let configs: LabelModel[] = [];
    chrome.storage.sync.get(["LABEL_WEBSITE"]).then((result) => {
      configs = result.LABEL_WEBSITE as LabelModel[];
      configs = configs.filter((x) => x.url !== config.url);
      configs.push(config);
      chrome.storage.sync.set({ LABEL_WEBSITE: configs }).then(() => {
        console.log("Saved!");
        props.isChanged();
      });
    });
  };

  return (
    <div className="flex flex-col items-center">
      <Input
        type="text"
        variant={"underlined"}
        color="primary"
        label="URL"
        value={url}
        description="Matches starts with URL (ex: http://localhost)"
        onValueChange={(x) => setUrl(x)}
      />
      <Input
        type="text"
        variant={"underlined"}
        color="primary"
        label="Label"
        value={label}
        description="The Label text you want to show. (ex: PROD, UAT)"
        onValueChange={(x) => setLabel(x)}
      />
      <div className="flex flex-row gap-4 w-full">
        <Input
          type="color"
          variant={"underlined"}
          color="primary"
          label="Label Color"
          value={labelColor}
          onValueChange={(x) => setLabelColor(x)}
        />
        <Input
          type="color"
          variant={"underlined"}
          color="primary"
          label="Text Color"
          value={textColor}
          onValueChange={(x) => setTextColor(x)}
        />
      </div>
      <Button
        color="primary"
        variant="shadow"
        className="mt-4 mb-2"
        onClick={save}
      >
        Save
      </Button>
    </div>
  );
}
