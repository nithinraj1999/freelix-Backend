import { IAdminDashboardRepository } from "../../../domain/interfaces/admin/repository/IAdminDashboardRepository"
import { IAdminDashboardUseCase } from "../../../domain/interfaces/admin/useCases/IAdminDashboardUseCase"

export class AdminDashboardUseCase  implements IAdminDashboardUseCase{
    constructor(private adminDashboardRepository: IAdminDashboardRepository) {}
    getDashboardData() {
      return this.adminDashboardRepository.getDashboardData()
    }
}
  