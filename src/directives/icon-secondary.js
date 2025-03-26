export default {
  //el - the element the binding sits on
  //binding - object with arguments that are passed into the hooks (treat as read only)
  //vnode - allows to refer directly to the node in the virtual DOM (treat as read only)
  //prevNode - the previous vnode object, only available in beforeUpdate and updated lifecycle hooks (treat as read only)
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value.icon} text-2xl`

    if (binding.value.right) {
      iconClass += ' float-right'
    }

    if (!binding.value.color) {
      iconClass += ' text-green-400'
    } else {
      iconClass += ` text-${binding.value.color}-400`
    }
    el.innerHTML += `<i class="${iconClass}"/>`
  },
}
