export default {
  //el - the element the binding sits on
  //binding - object with arguments that are passed into the hooks (treat as read only)
  //vnode - allows to refer directly to the node in the virtual DOM (treat as read only)
  //prevNode - the previous vnode object, only available in beforeUpdate and updated lifecycle hooks (treat as read only)
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value} text-2xl`

    if (binding.arg === 'full') {
      iconClass = binding.value
    }

    if (binding.modifiers.right) {
      iconClass += ' float-right'
    }

    if (binding.modifiers.yellow) {
      iconClass += ' text-yellow-400'
    } else {
      iconClass += ' text-green-400'
    }

    el.innerHTML += `<i class="${iconClass}"/>`
  },
}
