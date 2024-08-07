// @IMPORT-START
import Components from "../components/components"
const { defineCustomComponent } = Components
// @IMPORT("../components/components")
// @IMPORT-END

// @IMPORT-START
import Util from "../util/util"
const { ax } = Util
// @IMPORT("../util/util")
// @IMPORT-END

// @IMPORT-START
import Html from "./html"
const { input, textarea, select } = Html
// @IMPORT("./html")
// @IMPORT-END

// @IMPORT-START
import CreateElement from "../components/create-element"
const { createElement } = CreateElement
// @IMPORT("../components/create-element")
// @IMPORT-END

const defineInputComponent = (componentName: string, props: any) => {
  return defineCustomComponent(componentName, {
    render: (statex: any, setStatex: any, propsx: any) => {
      const {
        name,
        type,
        inputMode,
        min,
        max,
        step,
        pattern,
        required,
        readonly,
        minLength,
        maxLength,
        disabled,
        spellcheck,
        autocomplete,
      } = props

      return input(
        undefined,
        undefined,
        ax(
          { value: statex.value ?? "" },
          {
            name,
            id: name,
            "aria-label": name,
            type: type,
            inputmode: inputMode,
            min,
            max,
            step,
            pattern,
            required,
            readonly,
            minLength,
            maxLength,
            disabled,
            spellcheck: spellcheck || "false",
            autocomplete: autocomplete || "false",
          },
        ),
        {
          onchange: `(function onChange(event){ var id = "${propsx.id}"; var thisInstance = findInstance(id);  if (thisInstance){ thisInstance.state = { value: event.target.value }; rerenderComponent(id); pruneInstances(); console.log("onChange -> "+event.target.value) } else { errorInstanceNotFound(id); } })(event)`,
        },
      )
    },
    initialState: { value: props && props.value ? props.value : "" },
    classname: "form-lg",
  })
}

const defineTextareaComponent = (componentName: string, props: any) => {
  return defineCustomComponent(componentName, {
    render: (statex: any, setStatex: any, propsx: any) => {
      const {
        name,
        type,
        inputMode,
        min,
        max,
        step,
        pattern,
        required,
        readonly,
        minLength,
        maxLength,
        disabled,
        spellcheck,
        autocomplete,
      } = props

      return textarea(
        undefined,
        undefined,
        ax(
          { value: statex.value ?? "" },
          {
            name,
            id: name,
            "aria-label": name,
            type: type,
            inputmode: inputMode,
            min,
            max,
            step,
            pattern,
            required,
            readonly,
            minLength,
            maxLength,
            disabled,
            spellcheck: spellcheck || "false",
            autocomplete: autocomplete || "false",
          },
        ),
        {
          onchange: `(function onChange(event){ var id = "${propsx.id}"; var thisInstance = findInstance(id);  if (thisInstance){ thisInstance.state = { value: event.target.value }; rerenderComponent(id); pruneInstances(); console.log("onChange -> "+event.target.value) } else { errorInstanceNotFound(id); } })(event)`,
        },
      )
    },
    initialState: { value: props && props.value ? props.value : "" },
    classname: "form-lg",
  })
}

const defineSelectComponent = (componentName: string, props: any) => {
  return defineCustomComponent(componentName, {
    render: (statex: any, setStatex: any, propsx: any) => {
      const { options, name, disabled, placeholder } = props

      return select(
        options
          ? options.map((option: { id: string; title: string }) =>
              createElement(
                "option",
                option.title,
                undefined,
                ax({ value: option.id }, { selected: option.id === statex.value && "selected" }),
              ),
            )
          : undefined,
        undefined,
        ax(
          { value: statex.value ?? "" },
          {
            name,
            id: name,
            "aria-label": name,
            options,
            disabled,
            placeholder,
          },
        ),
        {
          onchange: `(function onChange(event){ var id = "${propsx.id}"; var thisInstance = findInstance(id);  if (thisInstance){ thisInstance.state = { value: event.target.value }; rerenderComponent(id); pruneInstances(); console.log("onChange -> "+event.target.value) } else { errorInstanceNotFound(id); } })(event)`,
        },
      )
    },
    initialState: { value: props && props.value ? props.value : "" },
    classname: "form-lg",
  })
}

export default { defineInputComponent, defineTextareaComponent, defineSelectComponent }
