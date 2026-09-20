import { Component, type ErrorInfo, type ReactNode } from 'react'

/** Keep a failed editor render from unmounting the entire workspace. */
export class DocumentEditorBoundary extends Component<{children:ReactNode;onClose:()=>void},{failed:boolean}> {
  state={failed:false}
  static getDerivedStateFromError(){return {failed:true}}
  componentDidCatch(error:Error,info:ErrorInfo){console.error('文档编辑器打开失败',error,info.componentStack)}
  render(){
    if(this.state.failed)return <section className="document-editor-failure" role="alert"><h2>文档暂时无法打开</h2><p>已保存的内容仍然保留。请返回列表后重新打开；若仍失败，请保留此文档以便检查。</p><button type="button" onClick={this.props.onClose}>返回文档列表</button></section>
    return this.props.children
  }
}
