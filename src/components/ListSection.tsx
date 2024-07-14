import { Button } from "@nextui-org/react";
import { LabelModel } from "../types";

export default function ListSection(props: {
  config: LabelModel[];
  isEditing: (item: LabelModel) => void;
  isChanged: () => void;
}) {
  function remove(item: LabelModel) {
    props.config = props.config.filter((x) => x.url != item.url);
    chrome.storage.sync.set({ LABEL_WEBSITE: props.config }).then(() => {
      props.isChanged();
    });
  }

  return (
    <>
      <h3 className="underline decoration-primary">Label List</h3>
      {props.config.length == 0 && "No labels are added!"}
      <div className="flex flex-col gap-2 text-sm">
        {props.config.map(function (item) {
          return (
            <div
              className="w-full flex flex-row justify-between items-center border-b-2 border-transparent hover:border-[var(--label-color)]"
              style={
                {
                  "--label-color": item.labelColor,
                } as never
              }
            >
              <div className="space-x-2 overflow-hidden flex-auto flex flex-row">
                <p className="w-[100px] flex-none truncate" title={item.label}>
                  {item.label}
                </p>
                <p className="truncate items-start" title={item.url}>
                  {item.url}
                </p>
              </div>
              <div className="space-x-2 flex flex-row">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="success"
                  onClick={() => {
                    props.isEditing(item);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onClick={() => {
                    remove(item);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
