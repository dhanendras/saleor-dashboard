import { Backlink } from "@dashboard/components/Backlink";
import Container from "@dashboard/components/Container";
import Form from "@dashboard/components/Form";
import Grid from "@dashboard/components/Grid";
import Hr from "@dashboard/components/Hr";
import Metadata, { MetadataFormData } from "@dashboard/components/Metadata";
import PageHeader from "@dashboard/components/PageHeader";
import Savebar from "@dashboard/components/Savebar";
import { PageErrorFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages, sectionNames } from "@dashboard/intl";
import { pageTypeListUrl } from "@dashboard/pageTypes/urls";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { Typography } from "@material-ui/core";
import { ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import PageTypeDetails from "../PageTypeDetails/PageTypeDetails";

export interface PageTypeForm extends MetadataFormData {
  name: string;
}

export interface PageTypeCreatePageProps {
  errors: PageErrorFragment[];
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit: (data: PageTypeForm) => void;
}

const formInitialData: PageTypeForm = {
  metadata: [],
  name: "",
  privateMetadata: [],
};

const useStyles = makeStyles(
  theme => ({
    hr: {
      gridColumnEnd: "span 2",
      margin: theme.spacing(1, 0),
    },
  }),
  {
    name: "PageTypeCreatePage",
  },
);

const PageTypeCreatePage: React.FC<PageTypeCreatePageProps> = props => {
  const { disabled, errors, saveButtonBarState, onSubmit } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const navigate = useNavigator();

  const {
    makeChangeHandler: makeMetadataChangeHandler,
  } = useMetadataChangeTrigger();

  return (
    <Form
      confirmLeave
      initial={formInitialData}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ change, data, submit, isSaveDisabled }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <Container>
            <Backlink href={pageTypeListUrl()}>
              {intl.formatMessage(sectionNames.pageTypes)}
            </Backlink>
            <PageHeader
              title={intl.formatMessage({
                id: "caqRmN",
                defaultMessage: "Create Page Type",
                description: "header",
              })}
            />
            <Grid variant="inverted">
              <div>
                <Typography>
                  {intl.formatMessage(commonMessages.generalInformations)}
                </Typography>
                <Typography variant="body2">
                  <FormattedMessage
                    id="kZfIl/"
                    defaultMessage="These are general information about this Content Type."
                  />
                </Typography>
              </div>
              <PageTypeDetails
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
              <Hr className={classes.hr} />
              <div>
                <Typography>
                  <FormattedMessage
                    id="OVOU1z"
                    defaultMessage="Metadata"
                    description="section header"
                  />
                </Typography>
              </div>
              <Metadata data={data} onChange={changeMetadata} />
              <div></div>
            </Grid>
            <Savebar
              onCancel={() => navigate(pageTypeListUrl())}
              onSubmit={submit}
              disabled={isSaveDisabled}
              state={saveButtonBarState}
            />
          </Container>
        );
      }}
    </Form>
  );
};
PageTypeCreatePage.displayName = "PageTypeCreatePage";
export default PageTypeCreatePage;
