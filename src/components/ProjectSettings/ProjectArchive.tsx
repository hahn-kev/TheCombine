import { Button } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { archiveProject, restoreProject } from "backend";
import { ButtonConfirmation } from "components/Dialogs";
import { themeColors } from "types/theme";

interface ProjectArchiveProps extends ButtonProps {
  archive?: boolean;
  projectId: string;
  updateParent: () => void | Promise<void>;
  warn?: boolean;
}

/**
 * Button for archiving/restoring project (changing isActive)
 */
export default function ProjectArchive(props: ProjectArchiveProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  async function updateProj() {
    if (props.archive) {
      await archiveProject(props.projectId);
    } else {
      await restoreProject(props.projectId);
    }
    handleClose();
    await props.updateParent();
  }

  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      <Button
        variant="contained"
        color={props.warn ? "secondary" : "primary"}
        onClick={handleOpen}
        id={`proj-${props.projectId}-${props.archive ? "archive" : "restore"}`}
        style={props.warn ? { color: themeColors.error } : {}}
      >
        {t(props.archive ? "buttons.archive" : "buttons.restore")}
      </Button>
      <ButtonConfirmation
        open={open}
        textId={
          props.archive
            ? "siteSettings.archiveProjectText"
            : "siteSettings.restoreProjectText"
        }
        titleId="buttons.proceedWithCaution"
        onClose={handleClose}
        onConfirm={updateProj}
        buttonIdClose={`proj-${props.projectId}-${
          props.archive ? "archive" : "restore"
        }-cancel`}
        buttonIdConfirm={`proj-${props.projectId}-${
          props.archive ? "archive" : "restore"
        }-confirm`}
      />
    </>
  );
}