import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { useResource } from "rest-hooks";

import { H2 } from "../../components/Titles";
import StepsMenu from "../../components/StepsMenu";
import SourceStep from "./components/SourceStep";
import DestinationStep from "./components/DestinationStep";
import ConnectionStep from "./components/ConnectionStep";
import SourceResource from "../../core/resources/Source";
import DestinationResource from "../../core/resources/Destination";
import config from "../../config";
import StepsConfig, { StepsTypes } from "./components/StepsConfig";
import PrepareDropDownLists from "./components/PrepareDropDownLists";
import { Routes } from "../routes";
import useRouter from "../../components/hooks/useRouterHook";
import { SyncSchema } from "../../core/resources/Schema";
import { AnalyticsService } from "../../core/analytics/AnalyticsService";
import useSource from "../../components/hooks/services/useSourceHook";
import useDestination from "../../components/hooks/services/useDestinationHook";
import useConnection from "../../components/hooks/services/useConnectionHook";

const Content = styled.div`
  width: 100%;
  max-width: 638px;
  margin: 0 auto;
  padding: 33px 0;
`;

const Img = styled.img`
  text-align: center;
  width: 100%;
`;

const MainTitle = styled(H2)`
  margin-top: -39px;
  font-family: ${({ theme }) => theme.highlightFont};
  color: ${({ theme }) => theme.darkPrimaryColor};
  letter-spacing: 0.008em;
  font-weight: bold;
`;

const Subtitle = styled.div`
  font-size: 14px;
  line-height: 21px;
  color: ${({ theme }) => theme.greyColor40};
  text-align: center;
  margin-top: 7px;
`;

const StepsCover = styled.div`
  margin: 33px 0 28px;
`;

const OnboardingPage: React.FC = () => {
  useEffect(() => {
    AnalyticsService.page("Onboarding Page");
  }, []);

  const { push } = useRouter();
  const { createSource, recreateSource } = useSource();
  const { createDestination, recreateDestination } = useDestination();
  const { createConnection } = useConnection();

  const { sources } = useResource(SourceResource.listShape(), {
    workspaceId: config.ui.workspaceId
  });
  const { destinations } = useResource(DestinationResource.listShape(), {
    workspaceId: config.ui.workspaceId
  });

  const [successRequest, setSuccessRequest] = useState(false);
  const [errorStatusRequest, setErrorStatusRequest] = useState<number>(0);

  const afterUpdateStep = () => {
    setSuccessRequest(false);
    setErrorStatusRequest(0);
  };

  const { currentStep, steps, setCurrentStep } = StepsConfig(
    !!sources.length,
    !!destinations.length,
    afterUpdateStep
  );

  const {
    sourcesDropDownData,
    destinationsDropDownData,
    getSourceDefinitionById,
    getDestinationDefinitionById
  } = PrepareDropDownLists();

  const onSubmitSourceStep = async (values: {
    name: string;
    serviceType: string;
    sourceId?: string;
    connectionConfiguration?: any;
  }) => {
    setErrorStatusRequest(0);
    const sourceConnector = getSourceDefinitionById(values.serviceType);

    try {
      if (!!sources.length) {
        await recreateSource({
          values,
          sourceId: sources[0].sourceId
        });
      } else {
        await createSource({ values, sourceConnector });
      }

      setSuccessRequest(true);
      setTimeout(() => {
        setSuccessRequest(false);
        setCurrentStep(StepsTypes.CREATE_DESTINATION);
      }, 2000);
    } catch (e) {
      setErrorStatusRequest(e.status);
    }
  };

  const onSubmitDestinationStep = async (values: {
    name: string;
    serviceType: string;
    destinationDefinitionId?: string;
    connectionConfiguration?: any;
  }) => {
    setErrorStatusRequest(0);
    const destinationConnector = getDestinationDefinitionById(
      values.serviceType
    );

    try {
      if (!!destinations.length) {
        await recreateDestination({
          values,
          destinationId: destinations[0].destinationId
        });
      } else {
        await createDestination({
          values,
          destinationConnector
        });
      }

      setSuccessRequest(true);
      setTimeout(() => {
        setSuccessRequest(false);
        setCurrentStep(StepsTypes.SET_UP_CONNECTION);
      }, 2000);
    } catch (e) {
      setErrorStatusRequest(e.status);
    }
  };

  const onSubmitConnectionStep = async (values: {
    frequency: string;
    syncSchema: SyncSchema;
  }) => {
    const sourceDefinition = getSourceDefinitionById(
      sources[0].sourceDefinitionId
    );
    const destinationDefinition = getDestinationDefinitionById(
      destinations[0].destinationDefinitionId
    );

    setErrorStatusRequest(0);
    try {
      await createConnection({
        values,
        source: sources[0],
        destinationId: destinations[0].destinationId,
        sourceDefinition,
        destinationDefinition
      });

      push(Routes.Root);
    } catch (e) {
      setErrorStatusRequest(e.status);
    }
  };

  const renderStep = () => {
    if (currentStep === StepsTypes.CREATE_SOURCE) {
      return (
        <SourceStep
          onSubmit={onSubmitSourceStep}
          dropDownData={sourcesDropDownData}
          hasSuccess={successRequest}
          errorStatus={errorStatusRequest}
          source={sources.length && !successRequest ? sources[0] : undefined}
        />
      );
    }
    if (currentStep === StepsTypes.CREATE_DESTINATION) {
      return (
        <DestinationStep
          onSubmit={onSubmitDestinationStep}
          dropDownData={destinationsDropDownData}
          hasSuccess={successRequest}
          errorStatus={errorStatusRequest}
          currentSourceDefinitionId={sources[0].sourceDefinitionId}
          destination={
            destinations.length && !successRequest ? destinations[0] : undefined
          }
        />
      );
    }

    return (
      <ConnectionStep
        onSubmit={onSubmitConnectionStep}
        sourceDefinitionId={sources[0].sourceDefinitionId}
        destinationDefinitionId={destinations[0].destinationDefinitionId}
        errorStatus={errorStatusRequest}
        sourceId={sources[0].sourceId}
      />
    );
  };

  return (
    <Content>
      <Img src="/welcome.svg" height={132} />
      <MainTitle center>
        <FormattedMessage id={"onboarding.title"} />
      </MainTitle>
      <Subtitle>
        <FormattedMessage id={"onboarding.subtitle"} />
      </Subtitle>
      <StepsCover>
        <StepsMenu data={steps} activeStep={currentStep} />
      </StepsCover>
      {renderStep()}
    </Content>
  );
};

export default OnboardingPage;
