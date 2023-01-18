import { WebhookEventTypeAsyncEnum } from "@dashboard/graphql";
import {
  CopyIcon,
  GraphiQLProvider,
  GraphiQLProviderProps,
  KeyboardShortcutIcon,
  PlayIcon,
  PrettifyIcon,
  QueryEditor,
  ToolbarButton,
  Tooltip,
  UnStyledButton,
  useCopyQuery,
  useDragResize,
  useEditorContext,
  UseHeaderEditorArgs,
  usePluginContext,
  usePrettifyEditors,
  UseQueryEditorArgs,
  UseResponseEditorArgs,
  UseVariableEditorArgs,
  WriteableEditorProps,
} from "@graphiql/react";
import { makeStyles, useTheme } from "@saleor/macaw-ui";
import React, {
  ComponentType,
  PropsWithChildren,
  ReactNode,
  useState,
} from "react";

import { DryRun } from "../DryRun";

export interface GraphiQLToolbarConfig {
  /**
   * This content will be rendered after the built-in buttons of the toolbar.
   * Note that this will not apply if you provide a completely custom toolbar
   * (by passing `GraphiQL.Toolbar` as child to the `GraphiQL` component).
   */
  additionalContent?: React.ReactNode;
}

export type GraphiQLProps = Omit<GraphiQLProviderProps, "children"> &
  GraphiQLInterfaceProps;

export function GraphiQL({
  dangerouslyAssumeSchemaIsValid,
  defaultQuery,
  defaultTabs,
  externalFragments,
  fetcher,
  getDefaultFieldNames,
  headers,
  initialTabs,
  inputValueDeprecation,
  introspectionQueryName,
  maxHistoryLength,
  onEditOperationName,
  onSchemaChange,
  onTabChange,
  onTogglePluginVisibility,
  operationName,
  plugins,
  query,
  response,
  schema,
  schemaDescription,
  shouldPersistHeaders,
  storage,
  validationRules,
  variables,
  visiblePlugin,
  defaultHeaders,
  ...props
}: GraphiQLProps & { asyncEvents: WebhookEventTypeAsyncEnum[] }) {
  // Ensure props are correct
  if (typeof fetcher !== "function") {
    throw new TypeError(
      "The `GraphiQL` component requires a `fetcher` function to be passed as prop.",
    );
  }

  const [showDialog, setShowDialog] = useState(false);
  const [result, setResult] = useState("");

  return (
    <GraphiQLProvider
      getDefaultFieldNames={getDefaultFieldNames}
      dangerouslyAssumeSchemaIsValid={dangerouslyAssumeSchemaIsValid}
      defaultQuery={defaultQuery}
      defaultHeaders={defaultHeaders}
      defaultTabs={defaultTabs}
      externalFragments={externalFragments}
      fetcher={fetcher}
      headers={headers}
      initialTabs={initialTabs}
      inputValueDeprecation={inputValueDeprecation}
      introspectionQueryName={introspectionQueryName}
      maxHistoryLength={maxHistoryLength}
      onEditOperationName={onEditOperationName}
      onSchemaChange={onSchemaChange}
      onTabChange={onTabChange}
      onTogglePluginVisibility={onTogglePluginVisibility}
      plugins={plugins}
      visiblePlugin={visiblePlugin}
      operationName={operationName}
      query={query}
      response={response}
      schema={schema}
      schemaDescription={schemaDescription}
      shouldPersistHeaders={shouldPersistHeaders}
      storage={storage}
      validationRules={validationRules}
      variables={variables}
    >
      <GraphiQLInterface
        {...props}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        result={result}
      />
      <DryRun
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        query={query}
        setResult={setResult}
        asyncEvents={props.asyncEvents}
      />
    </GraphiQLProvider>
  );
}
// Export main windows/panes to be used separately if desired.
GraphiQL.Toolbar = GraphiQLToolbar;

type AddSuffix<Obj extends Record<string, any>, Suffix extends string> = {
  // @ts-ignore
  [Key in keyof Obj as `${string & Key}${Suffix}`]: Obj[Key];
};

export type GraphiQLInterfaceProps = WriteableEditorProps &
  AddSuffix<Pick<UseQueryEditorArgs, "onEdit">, "Query"> &
  Pick<UseQueryEditorArgs, "onCopyQuery"> &
  AddSuffix<Pick<UseVariableEditorArgs, "onEdit">, "Variables"> &
  AddSuffix<Pick<UseHeaderEditorArgs, "onEdit">, "Headers"> &
  Pick<UseResponseEditorArgs, "responseTooltip"> & {
    children?: ReactNode;
    /**
     * Set the default state for the editor tools.
     * - `false` hides the editor tools
     * - `true` shows the editor tools
     * - `'variables'` specifically shows the variables editor
     * - `'headers'` specifically shows the headers editor
     * By default the editor tools are initially shown when at least one of the
     * editors has contents.
     */
    defaultEditorToolsVisibility?: boolean | "variables" | "headers";
    /**
     * Toggle if the headers editor should be shown inside the editor tools.
     * @default true
     */
    isHeadersEditorEnabled?: boolean;
    /**
     * An object that allows configuration of the toolbar next to the query
     * editor.
     */
    toolbar?: GraphiQLToolbarConfig;

    // TODO
    showDialog?: boolean;
    setShowDialog?: React.Dispatch<React.SetStateAction<boolean>>;
    result?: string;
  };

const useStyles = makeStyles(
  () => ({
    pre: {
      whiteSpace: "break-spaces",
    },
  }),
  { name: "GraphiQLInterface" },
);

export function GraphiQLInterface(props: GraphiQLInterfaceProps) {
  const classes = useStyles();
  const editorContext = useEditorContext({ nonNull: true });
  const pluginContext = usePluginContext();

  const copy = useCopyQuery({ onCopyQuery: props.onCopyQuery });
  const prettify = usePrettifyEditors();

  const PluginContent = pluginContext?.visiblePlugin?.content;

  const pluginResize = useDragResize({
    defaultSizeRelation: 1 / 3,
    direction: "horizontal",
    initiallyHidden: pluginContext?.visiblePlugin ? undefined : "first",
    onHiddenElementChange: resizableElement => {
      if (resizableElement === "first") {
        // pluginContext?.setVisiblePlugin(null);
      }
    },
    sizeThresholdSecond: 200,
    storageKey: "docExplorerFlex",
  });
  const editorResize = useDragResize({
    direction: "horizontal",
    storageKey: "editorFlex",
  });
  const editorToolsResize = useDragResize({
    defaultSizeRelation: 3,
    direction: "vertical",
    // initiallyHidden: (() => {
    //   if (
    //     props.defaultEditorToolsVisibility === 'variables' ||
    //     props.defaultEditorToolsVisibility === 'headers'
    //   ) {
    //     return undefined;
    //   }

    //   if (typeof props.defaultEditorToolsVisibility === 'boolean') {
    //     return props.defaultEditorToolsVisibility ? undefined : 'second';
    //   }

    //   return editorContext.initialVariables || editorContext.initialHeaders
    //     ? undefined
    //     : 'second';
    // })(),
    sizeThresholdSecond: 60,
    storageKey: "secondaryEditorFlex",
  });

  const children = React.Children.toArray(props.children);

  const toolbar = children.find(child =>
    isChildComponentType(child, GraphiQL.Toolbar),
  ) || (
    <>
      <ToolbarButton onClick={() => props.setShowDialog(true)} label="Dry run">
        <PlayIcon className="graphiql-toolbar-icon" aria-hidden="true" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => prettify()}
        label="Prettify query (Shift-Ctrl-P)"
      >
        <PrettifyIcon className="graphiql-toolbar-icon" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton onClick={() => copy()} label="Copy query (Shift-Ctrl-C)">
        <CopyIcon className="graphiql-toolbar-icon" aria-hidden="true" />
      </ToolbarButton>
      {props.toolbar?.additionalContent || null}
    </>
  );

  const onClickReference = () => {
    if (pluginResize.hiddenElement === "first") {
      pluginResize.setHiddenElement(null);
    }
  };

  const theme = useTheme();
  const rootStyle = {
    "--font-size-body": theme.typography.body2.fontSize,
    "--font-size-h2": theme.typography.h3.fontSize,
    "--font-size-h3": theme.typography.h3.fontSize,
    "--font-size-h4": theme.typography.h4.fontSize,
    "--font-size-hint": theme.typography.caption.fontSize,
    "--font-size-inline-code": theme.typography.caption.fontSize,
  } as React.CSSProperties;

  return (
    <div
      data-testid="graphiql-container"
      className="graphiql-container"
      style={rootStyle}
    >
      <div className="graphiql-sidebar">
        <div className="graphiql-sidebar-section">
          {pluginContext?.plugins.map(plugin => {
            const isVisible = plugin === pluginContext.visiblePlugin;
            const label = `${isVisible ? "Hide" : "Show"} ${plugin.title}`;
            const Icon = plugin.icon;
            return (
              <Tooltip key={plugin.title} label={label}>
                <UnStyledButton
                  type="button"
                  className={isVisible ? "active" : ""}
                  onClick={() => {
                    if (isVisible) {
                      pluginContext.setVisiblePlugin(null);
                      pluginResize.setHiddenElement("first");
                    } else {
                      pluginContext.setVisiblePlugin(plugin);
                      pluginResize.setHiddenElement(null);
                    }
                  }}
                  aria-label={label}
                >
                  <Icon aria-hidden="true" />
                </UnStyledButton>
              </Tooltip>
            );
          })}
        </div>
        <div className="graphiql-sidebar-section">
          <Tooltip label="Open short keys dialog">
            <UnStyledButton
              type="button"
              onClick={() => props.setShowDialog(true)}
              aria-label="Open short keys dialog"
            >
              <KeyboardShortcutIcon aria-hidden="true" />
            </UnStyledButton>
          </Tooltip>
        </div>
      </div>
      <div className="graphiql-main">
        <div
          ref={pluginResize.firstRef}
          style={{
            // Make sure the container shrinks when containing long
            // non-breaking texts
            minWidth: "200px",
          }}
        >
          <div className="graphiql-plugin">
            {PluginContent ? <PluginContent /> : null}
          </div>
        </div>
        <div ref={pluginResize.dragBarRef}>
          {pluginContext?.visiblePlugin ? (
            <div className="graphiql-horizontal-drag-bar" />
          ) : null}
        </div>
        <div ref={pluginResize.secondRef} style={{ minWidth: 0 }}>
          <div className="graphiql-sessions">
            <div
              role="tabpanel"
              id="graphiql-session"
              className="graphiql-session"
              style={{ padding: "2rem 0 0 0" }}
              aria-labelledby={`graphiql-session-tab-${editorContext.activeTabIndex}`}
            >
              <div ref={editorResize.firstRef}>
                <div
                  className="graphiql-editors full-height"
                  style={{ boxShadow: "none" }}
                >
                  <div ref={editorToolsResize.firstRef}>
                    <section
                      className="graphiql-query-editor"
                      aria-label="Query Editor"
                      style={{ borderBottom: 0 }}
                    >
                      <div
                        className="graphiql-query-editor-wrapper"
                        style={{ fontSize: "1.6rem" }}
                      >
                        <QueryEditor
                          editorTheme={props.editorTheme}
                          keyMap={props.keyMap}
                          onClickReference={onClickReference}
                          onCopyQuery={props.onCopyQuery}
                          onEdit={props.onEditQuery}
                          readOnly={props.readOnly}
                        />
                      </div>
                      <div
                        className="graphiql-toolbar"
                        role="toolbar"
                        aria-label="Editor Commands"
                      >
                        {toolbar}
                      </div>
                    </section>
                  </div>
                </div>
                <div ref={editorResize.dragBarRef}>
                  <div className="graphiql-horizontal-drag-bar" />
                </div>
                <div ref={editorResize.secondRef}>
                  <div className="graphiql-response">
                    <pre className={classes.pre}>{props.result}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Configure the UI by providing this Component as a child of GraphiQL.
function GraphiQLToolbar<TProps>(props: PropsWithChildren<TProps>) {
  return <>{props.children}</>;
}

GraphiQLToolbar.displayName = "GraphiQLToolbar";

// Determines if the React child is of the same type of the provided React component
function isChildComponentType<T extends ComponentType>(
  child: any,
  component: T,
): child is T {
  if (
    child?.type?.displayName &&
    child.type.displayName === component.displayName
  ) {
    return true;
  }

  return child.type === component;
}

export default GraphiQL;
